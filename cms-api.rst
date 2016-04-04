Bazaar CMS Interface
********************

This interface is used for adding material to the Bazaar and viewing material through the Bazaar.
There is also one endpoint for viewing material.

CMS interface endpoints in this document:

=====================  ====== ======================================================================
ENDPOINT               METHOD DESCRIPTION
=====================  ====== ======================================================================
cms/materials          GET    Returns your materials
cms/materials          POST   Create a material
cms/materials/<uid>    PUT    Update a material
cms/materials/<uid>    GET    Get material
cms/materials<uid>     DELETE Delete material
cms/metadata           GET    Return all available metedata that can be added to the material.
cms/products           POST   Create a product.
cms/products/<uid>     PUT    Update product information.
cms/products/<uid>     GET    Get product information
cms/validate/<token>   GET    For viewing material. Get and validate view token. Returns user and resource data.
=====================  ====== ======================================================================


Authentication
==============

Authentication to the API occurs via HMAC256 hash token.
Hash token is calculated from the JSON payload and your secret key.
You can get your client_id and API secret key from the Bazaar administrator.

All API requests must be made over HTTPS. Requests made over plain HTTP will fail.

To make authenticated request to the Bazaar LMS API, you need to generate hash token and put authentication headers to your request.

Form of Authentication headers::

    Authentication = 'BAZAAR' + ' ' + client_id + ':' + calculated hash token

Hash token calculation example(Python 2.7)::

    import hashlib
    import hmac

    client_id = "example_client"
    message = bytes('''{"first_name":"Teppo","last_name":"Testaaja","email":"Teppo","user_id":123,"context_id":123,"context_title":"DETAILS","role":"student","school":"Koulu","school_id":1235,"city":"Helsinki","city_id":"0123456-7","oid":null,"add_resource_callback_url":"","cancel_callback_url":""}''').encode('utf-8')
    secret_key = bytes("bc0ec839034cc0a4fe68af506985ddb52c4cb959").encode('utf-8')

    header = "CMS" + ' ' + client_id + ':' + hmac.new(secret_key, message, digestmod=hashlib.sha256).hexdigest();
    print(header)

Example output::

    $ python test.py
    CMS example_client:8a5c839290690a145fc8f128aec4fba0970a004a230fad856d775ea7b528da80

Example authenticated Bazaar LMS request::

   GET cms/token HTTP/1.1
   Host: bazaar.gov
   Date: Mon, 3 Jul 2015 12:00:52 +0300
   Authentication: CMS example_client:8a5c839290690a145fc8f128aec4fba0970a004a230fad856d775ea7b528da80

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


Metadata and tags
=================

Metadata is built up by country, so first part of the metadata item always indicates country.
Metadata might have translations in other languages in some countries, but you can also use translated metadata.
Use ``metadata`` endpoints to receive all available metadatas or parts of it.

Metadata is a hierarchical data structure where each level is delimited with ``/`` character.

Tags are extra information about the material and you can create them as you wish.


Get metadata
------------

Metadata is flat map of pre-defined metadata.
There is also namespace *global* for global metadata mapping.
Normally it is more user friendly to use country specific metadata,
but if your material is designed to work globally, you can also use *global* metadatas.

=======================  ====== ======================================
ENDPOINT                 METHOD DESCRIPTION
=======================  ====== ======================================
cms/metadata             GET    Returns all available metadata.
cms/metadata/<country>   GET    Returns all available metadata by country
=======================  ====== ======================================


REQUEST::

    GET cms/metadata HTTP/1.1
    Host: bazaar.gov
    Date: Mon, 3 Jul 2015 12:00:52 +0300
    Authentication: CMS example_client:8a5c839290690a145fc8f128aec4fba0970a004a230fad856d775ea7b528da80


RESPONSE::

    {
        "success" : 1,
        "data" : [
            "fi/Kouluaste/1.luokka",
            "fi/Kouluaste/2.luokka",
            "fi/Kouluaste/3.luokka",
            "fi/Kouluaste/4.luokka",
            "fi/Kouluaste/5.luokka",
            "fi/Kouluaste/6.luokka",
            "fi/Kouluaste/7.luokka",
            "fi/Kouluaste/7.luokka",
            "global/Subject/Biology"
        ]
    }


Create, read, update and delete material
========================================

You can create, read, update and delete your material with these actions.


CRUD operation endpoints:

====================  ====== ================================
ENDPOINT              METHOD DESCRIPTION
====================  ====== ================================
cms/materials         GET    Return materials
cms/materials         POST   Create material
cms/materials/<uid>   PUT    Update material
cms/materials/<uid>   GET    Get material
cms/materials/<uid>   DELETE Delete material
====================  ====== ================================


Material params table:

====================== =====================  ================================
PARAMS                                         DESCRIPTION
====================== =====================  ================================
name                   required               Name (max. 255 chars)
description            required               Description (max. 2048 chars)
language               required               Material language
publisher_resource_id  required,unique        Publisher unique material id (in your system)
publisher_data                                Publisher additional data
metadata                                      Metadata in array format. Max 32 items. You must first get available metadatas with *cms/metadata*.
tags                                          Material tags max 32 items. Max length of a tag is 64.
images                                        Assoc array of images. See example.
====================== =====================  ================================

publisher_resource_id must be unique in your CMS, so you cannot have multiple materials with the same id.

Example material
----------------


Example material data::

    {
        "name": "Bazaar example",
        "active" : 0,
        "description": "Bazaar example material.",
        "language" : "fi-FI",
        "publisher_resource_id" : "123123123"
        "publisher_data" : "custom payload",
        "metadata": [
            "fi/Luokka-aste/1. Luokka",
            "fi/Luokka-aste/2. Luokka",
            "fi/Luokka-aste/3. Luokka",
            "fi/Oppiaine/Biologia",
        ],
        "tags" : ["Tag 1", "Tags 2"],

        "images" : {
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


Get materials
-------------

Returns material stored in Bazaar.
API returns max. 100 items at time.
You can use pagination to get more sequential data.
Call URL in the next_URL param to get next set of data.

====================  ====== ================================
ENDPOINT              METHOD DESCRIPTION
====================  ====== ================================
cms/materials         GET    Return materials
====================  ====== ================================


REQUEST::

    GET cms/materials HTTP/1.1
    Host: bazaar.gov
    Date: Mon, 3 Jul 2015 12:00:52 +0300
    Authentication: CMS example_client:8a5c839290690a145fc8f128aec4fba0970a004a230fad856d775ea7b528da80


RESPONSE::

    {
        "count": 1
        "data": [{
            "name": "Bazaar example",
            "description": "Bazaar example material.",
            "language": "fi-FI",
            "publisher_resource_id": "123123123"
            "publisher_url": "https:\/\/",
            "metadata": [
                "Kouluaste/1. Luokka",
                "Kouluaste/2. Luokka",
                "Kouluaste/2. Luokka",
                "Oppiaine/Biologia",
            ],
            "tags": ['Tag 1', 'Tags 2'],

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
        }],

        "pagination": {
           "next_url": "cms/materials?start=100",
        }
    }


Create material
---------------

To create a resource make following request:

REQUEST::

    POST cms/materials HTTP/1.1
    Host: bazaar.gov
    Date: Mon, 3 Jul 2015 12:00:52 +0300
    Authentication: CMS example_client:8a5c839290690a145fc8f128aec4fba0970a004a230fad856d775ea7b528da80

    {
        "name": "Bazaar example",
        "description": "Bazaar example material.",
        "language": "fi-FI",
        "publisher_resource_id": "123123123"
        "publisher_url": "https:\/\/",
        "metadata": [
            "fi/Kouluaste/1. Luokka.",
            "fi/Kouluaste/2. Luokka.",
            "fi/Kouluaste/2. Luokka.",
        ],
        "tags": ['Asiasana', 'Asiasana2'],
        "images": {
            "thumbnail": {
                "url": "https:\/\/bazaar.gov\/img\/thumb.jpg",
                "width": 150,
                "height": 150
            },
            "standard_resolution": {
                "url": "https:\/\/bazaar.gov\/img\/thumb.jpg",
                "width": 306,
                "height": 306
            },
            "low_resolution": {
                "url": "https:\/\/bazaar.gov\/img\/thumb.jpg",
                "width": 612,
                "height": 612
            }
        }
    }


RESPONSE::

    {
        "success": 1
        "resource_uid": "eb5b7565-a3b9-487a-92ef-ed6f86976299"
    }


Viewing material
================

User is redirected to your CMS with unique Bazaar token.
You must validate Bazaar view token from Bazaar with ``cms/validate/<token>`` Rest API call.
One token can only be validated once. The API returns ``401 Unauthorized`` if the token is expired.

=======================  ====== ======================================
ENDPOINT                 METHOD DESCRIPTION
=======================  ====== ======================================
cms/validate/<token>     GET    For viewing material. Get and validate view token. Returns user and resource data.
=======================  ====== ======================================


Token timeout example response
------------------------------

Bazaar has 1 minute timeout from the creation of the token.

TIMEOUT RESPONSE::

    {
        "success" : 0,
        "error" : 401,
        "error_message" : "Token timeout"
    }

USED TOKEN RESPONSE::

    {
        "success" : 0,
        "error" : 401,
        "error_message" : "Token already used"
    }


REQUEST::

    GET cms/validate/2602d8eca94a206db5e6f7cf3c6768fb3c330f26fb25ee00bbd5cc72d5c35ecd HTTP/1.1
    Host: bazaar.gov
    Date: Mon, 3 Jul 2015 12:00:52 +0300
    Authentication: CMS example_client:8a5c839290690a145fc8f128aec4fba0970a004a230fad856d775ea7b528da80


RESPONSE::

    {
        "success" : 1,
        "data": {
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
            "country" : "FI",
            "language" : "fi",
            "instance_id"  :  "3eef7414-268e-4be7-a1d8-6f5809859c63",
            "bazaar_user_id" :  "79f6ad94-126e-436f-9e66-b9ca9d84abc5",
            "bazaar_context_id" : "9d1a6415-5f76-41bf-853e-f1eb824518af",
            "lsr_store" : "https//bazaar.gov/",
            "publisher_material_id" : "A1"
            "resource_uid" : "7d59be29-0e76-472e-a26d-339606a2b20f",
            "resource_url" : "",
            "organization_name" : "Testikoulu",
            "organization_id": "c3552524-a864-44ee-8e77-52d728281935",
            "history_id" : "444735e09f0606de0d9f976d81594b1ae8c2e9386f00410c18e213d97a395937",
            "demo" :  0,
            "chargeable" : 0
        }
    }



Params from the Bazaar:

=======================  ================================
PARAM                    DESCRIPTION
=======================  ================================
first_name               First name of the user.
last_name                Last name of the user.
email                    Email of the user.
user_id                  User id from the LMS.
context_id               Context id from the LMS.
context_title            Context title from the LMS.
role                     User role. admin, teacher or student
school                   School's name.
school_id                School id
city                     City name
city_id                  City ID
oid                      Student ID
country                  Country code(ISO 3166-1 alpha-2)
language                 Language code (ISO 639-1)

instance_id              Globally uniqe instance ID from the Bazaar.
bazaar_user_id           Globally unique Bazaar user ID
bazaar_context_id        Globally unique Bazaar context ID

resource_uid             Bazaar resource ID
publisher_material_id    CMS material link #1
resource_url             CMS material link #2
organization_name        User organization nanme
organization_id          User organization ID in the Bazaard
history_id               Unique history ID of this transaction
=======================  ================================


