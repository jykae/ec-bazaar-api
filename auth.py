#!/usr/bin/env python
# -*- coding: utf-8 -*-

import hashlib
import hmac

client_id = "example_client"
message = bytes('''{"first_name":"Teppo","last_name":"Testaaja","email":"Teppo","user_id":123,"context_id":123,"context_title":"DETAILS","role":"student","school":"Koulu","school_id":1235,"city":"Helsinki","city_id":"0123456-7","oid":null,"add_resource_callback_url":"","cancel_callback_url":""}''').encode('utf-8')
secret_key = bytes("bc0ec839034cc0a4fe68af506985ddb52c4cb959").encode('utf-8')

header = "CMS" + ' ' + client_id + ':' + hmac.new(secret_key, message, digestmod=hashlib.sha256).hexdigest();
print(header)
