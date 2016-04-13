# EduCloud Bazaar API

API v2 reference implementation.

## Table of Contents

- [Implementation](#implementation)
- [Authentication](#authentication)
- [Documentation](#documentation)

## Implementation

Implemented with [Meteor](https://www.meteor.com/)

* [meteor-restivus](https://github.com/kahmali/meteor-restivus)
* [restivus-swagger](https://github.com/apinf/restivus-swagger)

## Authentication

Authentication is session-based [Meteor Restivus default authentication](https://github.com/apinf/restivus-swagger)

Token expiration is 1 day, if not logged out.

### Login
```
curl https://bazaardev.educloudalliance.org/api/v2/login -d "username=example&password=mypassword"
```
In response you will get *userId* and *authToken*

### Logout
```
curl http://bazaardev.educloudalliance.org/api/v2/logout -X POST -H "X-Auth-Token: <authToken>" -H "X-User-Id: <userId>"
```

### Authenticated calls
```
curl -H "X-Auth-Token: <authToken>" -H "X-User-Id: <userId>" https://bazaardev.educloudalliance.org/api/v2/materials
```

## Documentation

Swagger UI for trying out API: https://bazaardev.educloudalliance.org/api-docs
