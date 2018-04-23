# Simple Session Server

## How to use

```
node index.js ${port} ${expiredMins}
```

|API  | Method | Description | Input Body | Output Body |
|:--|:--|:--| :-- | :-- |
|session/|PUT|Create new session by random ID| `object` session data |`string` session id|
|session/`:sessionId`|PUT|Create new session| `object` session data| `string` session id |
|session/`:sessionId`|POST|Update session | `object` session data | |
|session/`:sessionId`|GET|Get session content| |`object` session content|
|session/`:sessionId`|DELETE|Delete session | | |

## Note

- If session expired or not found: statusCode = `404`
- If every thing is OK: statusCode = `200`
- If `POST` input data is *Undefined* or *{}*, session data will not change