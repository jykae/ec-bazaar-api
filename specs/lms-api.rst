Bazaar LMS Interface
********************

This interface is used for adding material to the LMS and viewing material from CMS in the LMS.
Bazaar implements licensing and provisioning and gives access to the material.
User is never redirected to the CMS, if user has no access to the material.

LMS interface endpoints in this document:

====================  ====== ================================
ENDPOINT              METHOD DESCRIPTION
====================  ====== ================================
lms/browse            POST   Browse and select material
lms/view              POST   View material
====================  ====== ================================


Authentication
==============

Authentication to the API occurs via HMAC256 hash token.
Hash token is calculated from the JSON payload and your secret key.
You can get your client_id and API secret key from the Bazaar administrator.

All API requests must be made over HTTPS. Requests made over plain HTTP will fail.

To make authenticated request to the Bazaar LMS api, you need to generate hash token and put authentication headers to your request.

How to generate Authentication headers::

	Authentication = 'BAZAAR' + ' ' + client_id + ':' + calculated hash token

Hash token calculation example(Python 2.7)::

	import hashlib
	import hmac

	client_id = "example_client"
	message = bytes('''{"first_name":"Teppo","last_name":"Testaaja","email":"Teppo","user_id":123,"context_id":123,"context_title":"DETAILS","role":"student","school":"Koulu","school_id":1235,"city":"Helsinki","city_id":"0123456-7","oid":null,"add_resource_callback_url":"","cancel_callback_url":""}''').encode('utf-8')
	secret_key = bytes("bc0ec839034cc0a4fe68af506985ddb52c4cb959").encode('utf-8')

	header = "BAZAAR" + ' ' + client_id + ':' + hmac.new(secret_key, message, digestmod=hashlib.sha256).hexdigest();
	print(header)


Example output::

	$ python test.py
	BAZAAR example_client:8a5c839290690a145fc8f128aec4fba0970a004a230fad856d775ea7b528da80

Example authenticated Bazaar LMS request::

   POST /api/v1/lms/select HTTP/1.1
   Host: bazaar.gov
   Date: Mon, 3 Jul 2015 12:00:52 +0300
   Authentication: BAZAAR example_client:8a5c839290690a145fc8f128aec4fba0970a004a230fad856d775ea7b528da80

   {"first_name":"Teppo","last_name":"Testaaja","email":"Teppo","user_id":123,"context_id":123,"context_title":"DETAILS","role":"student","school":"Koulu","school_id":1235,"city":"Helsinki","city_id":"0123456-7","oid":null,"add_resource_callback_url":"","cancel_callback_url":""}


Possible response codes
=======================

================ ===================
HTTP CODE        DESCRIPTION
================ ===================
200 OK           Request was ok.
400 Bad Request  Invalid parameters.
401 Unauthorized Invalid API key.
================ ===================


Errors
======

Bazaar uses HTTP response codes to indicate success or failure of an API request. Response code ``200 OK`` is returned if request was successfull.
Response code in ``4xx`` range indicates an error.
Same information is also provided in the body: ``success`` value is always returned.
Possible ``success`` values are 0 and 1 indicating failure and success.
Possible human readable error explanation is also returned in ``error``, if there were error.

Example failed response::

	{
		"success": 0,
		"error" : "Invalid API key."
	}


Browse and select material
==========================

User browses and selects material from Bazaar to the LMS. LMS must forward user to the returned url within 60 seconds. Returned unique URL will not work after 60 second period from creation.


====================  ====== ================================
ENDPOINT              METHOD DESCRIPTION
====================  ====== ================================
lms/browse            POST   Browse and select material
====================  ====== ================================


Web sequence diagram::

	LMS->Bazaar: browse request
	Bazaar->LMS: browse response
	LMS-> Bazaar: redirect user to the store
	Bazaar->LMS: pass data back to the LMS


Description of the workflow:

1. LMS makes a JSON POST request to the Bazaar with arguments using header-based auth.
2. Bazaar replies with unique URL.
3. LMS forwards user to the URL.
4. User selects material from the Bazaar and Bazaar forwards user back to the ``add_resource_callback_url``, with material details.

ARGUMENTS for lms/browser request:

==========================  ================================================ ============ =========
Parameter                   Description                                      Type         Required
==========================  ================================================ ============ =========
first_name                  First name of user.                              alpha 1-255   required
last_name                   Last name of user.                               alpha 1-255   required
email                       Email of user.                                   email         optional
user_id                     User id from                                     alpha 1-128   required
context_id                  Course or page identifier. Must be unique.       alpha 1-128   required
context_title               Course or page title                             alpha 1-128   required
role                        Role (enum student, teacher, admin)              enum          required
school                      Name of the school                               alpha 1-128   required
school_id                   School's identifier in the national level.       alpha 5-10    required
city                        City's name                                      alpha 1-64    required
city_id                     City's unique identifier in the national level   alpha 1-10    required
oid                         User oid                                         alpha 1-32    optional
add_resource_callback_url   LMS callback URL, for adding material to the LMS url           optional
cancel_url                  Forwarding user back to  LMS                     url           optional
==========================  ================================================ ============ =========


Response
--------

Returns JSON object with URL. Browser is redirected to this URL. New URL is always generated.

EXAMPLE REQUEST::

	POST /api/v1/lms/browse HTTP/1.1
	Host: bazaar.gov
	Date: Mon, 3 Jul 2015 12:00:52 +0300
	Authentication: BAZAAR example_client:8a5c839290690a145fc8f128aec4fba0970a004a230fad856d775ea7b528da80

	{"first_name":"Teppo","last_name":"Testaaja","email":"Teppo","user_id":123,"context_id":123,"context_title":"DETAILS","role":"student","school":"Koulu","school_id":1235,"city":"Helsinki","city_id":"0123456-7","oid":null,"add_resource_callback_url":"","cancel_callback_url":""}

EXAMPLE SUCCESSFUL RESPONSE::

	{
		"success": 1,
		"browse_url": "https:\/\/bazaar.gov\/browse"
	}


add_resource_callback_url and cancel_url
----------------------------------------

LMS must implement ``add_resource_callback_url`` and ``cancel_url``.
When user selects material from the Bazaar, form is submitted from the Bazaar to the LMS ``add_resource_callback_url``.
When user cancels adding material, user is forwarded to the url in ``cancel_url``.

JSON object is BASE64 encoded and included in the hidden element of the form. See example below.

``add_resource_callback_url`` arguments:

==========================  ================================================ ============== =========
Parameter                   Description                                      Type           Required
==========================  ================================================ ============== =========
name                        Name                                             alpha 1-128    required
description                 Descrpition                                      alpha -2000    required
uid                         Bazaar resource identified                       128bit UUID    required
images                      thumbnail, standard_resolution and
                            low_resolution images.
==========================  ================================================ ============== =========


Example payload from the Bazaar to the LMS::

	{
		"name": "Bazaar Example",
		"description": "Long text, Long text, Long text, Long text",
		"uid": "dc38da67-bb73-4062-8c67-a6e76e6c8f69",
		"images": {
			"thumbnail": {
				"url": "https:\/\/bazaard.gov\/img\/thumb.jpg",
				"width": 150,
				"height": 150
			},
			"standard_resolution": {
				"url": "https:\/\/bazaard.gov\/img\/thumb.jpg",
				"width": 306,
				"height": 306
			},
			"low_resolution": {
				"url": "https:\/\/bazaard.gov\/img\/thumb.jpg",
				"width": 612,
				"height": 612
			}
		}
	}


Example form
------------

In this example JSON payload is BASE64 encoded and ``add_resource_callback_url`` is ``https://lms.gov/course/21/add``.

Example form, which is submitted automatically, when material selection is finished and material data is submitted to the LMS::

	<form action="https://lms.gov/course/21/add" method="POST">
		<input type="hidden" name="params" value="ewogICAgIm5hbWUiOiAiQmF6YWFyIEV4YW1wbGUiLAogICAgImRlc2NyaXB0aW9uIjogIkxvbmcgdGV4dCwgTG9uZyB0ZXh0LCBMb25nIHRleHQsIExvbmcgdGV4dCIsCiAgICAiaW1hZ2VzIjogewogICAgICAgICJ0aHVtYm5haWwiOiB7CiAgICAgICAgICAgICJ1cmwiOiAiaHR0cHM6XC9cL2JhemFhcmQuZ292XC9pbWdcL3RodW1iLmpwZyIsCiAgICAgICAgICAgICJ3aWR0aCI6IDE1MCwKICAgICAgICAgICAgImhlaWdodCI6IDE1MAogICAgICAgIH0sCiAgICAgICAgInN0YW5kYXJkX3Jlc29sdXRpb24iOiB7CiAgICAgICAgICAgICJ1cmwiOiAiaHR0cHM6XC9cL2JhemFhcmQuZ292XC9pbWdcL3RodW1iLmpwZyIsCiAgICAgICAgICAgICJ3aWR0aCI6IDMwNiwKICAgICAgICAgICAgImhlaWdodCI6IDMwNgogICAgICAgIH0sCiAgICAgICAgImxvd19yZXNvbHV0aW9uIjogewogICAgICAgICAgICAidXJsIjogImh0dHBzOlwvXC9iYXphYXJkLmdvdlwvaW1nXC90aHVtYi5qcGciLAogICAgICAgICAgICAid2lkdGgiOiA2MTIsCiAgICAgICAgICAgICJoZWlnaHQiOiA2MTIKICAgICAgICB9CiAgICB9LAogICAgInVpZCI6ICJkYzM4ZGE2Ny1iYjczLTQwNjItOGM2Ny1hNmU3NmU2YzhmNjkiCn0=">
	</form>

LMS must then BASE64 decode params from the params field to get the JSON payload described.

Example of decoding BASE64 encoded JSON::

	import base64
	import json

	params = '''ewogICAgIm5hbWUiOiAiQmF6YWFyIEV4YW1wbGUiLAogICAgImRlc2NyaXB0aW9uIjogIkxvbmcgdGV4dCwgTG9uZyB0ZXh0LCBMb25nIHRleHQsIExvbmcgdGV4dCIsCiAgICAiaW1hZ2VzIjogewogICAgICAgICJ0aHVtYm5haWwiOiB7CiAgICAgICAgICAgICJ1cmwiOiAiaHR0cHM6XC9cL2JhemFhcmQuZ292XC9pbWdcL3RodW1iLmpwZyIsCiAgICAgICAgICAgICJ3aWR0aCI6IDE1MCwKICAgICAgICAgICAgImhlaWdodCI6IDE1MAogICAgICAgIH0sCiAgICAgICAgInN0YW5kYXJkX3Jlc29sdXRpb24iOiB7CiAgICAgICAgICAgICJ1cmwiOiAiaHR0cHM6XC9cL2JhemFhcmQuZ292XC9pbWdcL3RodW1iLmpwZyIsCiAgICAgICAgICAgICJ3aWR0aCI6IDMwNiwKICAgICAgICAgICAgImhlaWdodCI6IDMwNgogICAgICAgIH0sCiAgICAgICAgImxvd19yZXNvbHV0aW9uIjogewogICAgICAgICAgICAidXJsIjogImh0dHBzOlwvXC9iYXphYXJkLmdvdlwvaW1nXC90aHVtYi5qcGciLAogICAgICAgICAgICAid2lkdGgiOiA2MTIsCiAgICAgICAgICAgICJoZWlnaHQiOiA2MTIKICAgICAgICB9CiAgICB9LAogICAgInVpZCI6ICJkYzM4ZGE2Ny1iYjczLTQwNjItOGM2Ny1hNmU3NmU2YzhmNjkiCn0='''
	payload = base64.b64decode(params)
	print json.dumps( json.loads(payload))

Output::

	$ python decode.py
	{"images": {"low_resolution": {"url": "https://bazaard.gov/img/thumb.jpg", "width": 612, "height": 612}, "thumbnail": {"url": "https://bazaard.gov/img/thumb.jpg", "width": 150, "height": 150}, "standard_resolution": {"url": "https://bazaard.gov/img/thumb.jpg", "width": 306, "height": 306}}, "uid": "dc38da67-bb73-4062-8c67-a6e76e6c8f69", "name": "Bazaar Example", "description": "Long text, Long text, Long text, Long text"}


Viewing material
================

Person views selected material. LMS must always make a new view request when users wants to view material. LMS must
forward user to the returned url within 60 seconds. Returned unique URL will not work after 60 second period from creation.

====================  ====== ================================
ENDPOINT              METHOD DESCRIPTION
====================  ====== ================================
lms/view              POST   View material.
====================  ====== ================================

Web sequence diagram::

	participant LMS
	participant Bazaar
	participant CMS

	LMS->Bazaar: open request
	Bazaar->LMS: open response
	LMS->Bazaar: open unique url
	Bazaar->CMS: forward to CMS endpoint



Description
-----------

1. LMS makes a JSON POST request to the Bazaar with arguments for lms/view using header-based authentication.
2. Bazaar replies with unique url and LMS forwards user to the unique url.
3. Bazaar forwards user to the selected material with unique token.
4. LMS gets users user data from the Bazaar using token.


Arguments for lms/view
----------------------

==========================  ================================================  ============  =========
Parameter                   Description                                       Type           Required
==========================  ================================================  ============  =========
first_name                  First name of user.                               alpha 1-255   required
last_name                   Last name of user.                                alpha 1-255   required
email                       Email of user.                                    email         optional
user_id                     User id from LMS                                  alpha 1-255   required
context_id                  Course or page identifier. Must be unique.        alpha 1-128   required
context_title               Course or page title                              alpha 1-128   required
role                        Role (enum student, teacher, admin)               enum          required
school                      Name of the school                                alpha 1-128   required
school_id                   School's identifier in the national level.        alpha 5-10    required
city                        City's name                                       alpha 1-64    required
city_id                     City's unique identifier in the national level    alpha 1-10    required
oid                         User oid                                          alpha 1-32    optional
resource_uid                Resource Bazaar UUID                               128bit UUID   required
return_url                  Forwarding user back to the LMS                   url           optional
==========================  ================================================  ============  =========


Example request::

	POST lms/view HTTP/1.1
	Host: bazaar.gov
	Date: Mon, 3 Jul 2015 12:00:52 +0300
	Authentication: BAZAAR example_client:8a5c839290690a145fc8f128aec4fba0970a004a230fad856d775ea7b528da80
	{
	    "first_name": "Teppo",
	    "last_name": "Testaaja",
	    "email": "Teppo",
	    "user_id": 123,
	    "context_id": 123,
	    "context_title": "DETAILS",
	    "role": "student",
	    "school": "Koulu",
	    "school_id": 1235,
	    "city": "Helsinki",
	    "city_id": "0123456-7",
	    "oid": null,
	    "resource_uid": "dc38da67-bb73-4062-8c67-a6e76e6c8f69",
	    "return_url": "https:\/\/lms.gov\/"
	}


Example response::

	{
	    "success": 1,
	    "view_url": "https:\/\/bazaar.gov\/df0ae5a63ab170f69706301d4d5b0356a0e800108b9e2fed26e36116b88cce28"
	}

