DevTinder APIs

authRouter
- POST /signup
- POST /login
- POST /logout

profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionRequestRouter
For the intent ("interested", "ignored") we will take the intent in request params, just like toUserId
- POST /request/send/:status/:toUserId
    - POST /request/send/interested/:userId
    - POST /request/send/ignored/:userId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

Status ENUM of a connectionRequest
ignored, interested, accepted, rejected

userRouter
- GET /user/connections
- GET /user/requests/recieved
- GET /user/feed - Gets you the profiles of other users on the platform


