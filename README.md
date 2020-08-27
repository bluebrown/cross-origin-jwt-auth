# JWT Exchange Authentication

This repository contains three separate applications. A rest API, an application server that hosts a static web page, and an authentication service.

In order to retrieve data from the API, a valid JWT has to be included as bearer authorization header. To get this token the requester must authenticate against the authentication service.

When the login endpoint on the API is hit, the request is redirected to the authentication service including a JWT in the request query string to identify the redirecting API against the auth service. The auth service challenges the requester then with a 401 status code for basic auth. If the requester succeeds in authenticating, the auth service redirects the request back to the API with a JWT in the request query string. This token contains the users' identity.

Both token participating in the *token exchange* are short living, meaning they will expire within a few seconds. After the exchange was successfully performed, the API generates a token, containing the users identity and roles, and sends it back to the requester. This toke has longer life span and can be used to retrieve the actual data.

The application server serves a example html file from which a token can be issued and API data retrieved.
