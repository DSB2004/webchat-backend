


TOKEN="Bearer eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiQUNDRVNTX1RPS0VOIiwiZW1haWwiOiJkYW1hbmplZXRzaW5naEBnbWFpbC5jb20iLCJpZCI6IjkwNTZmOGFiLTc0NDItNDNjMS1iNTE2LTY2YTZkODNkMTkzZCIsImlhdCI6MTc1MDYwODczMSwiZXhwIjoxNzUwNjk1MTMxfQ.e_RK4a8JEj1szXdOUxGC439V9LnbBMbZjmWfFHSMDxw" 

CONCURRENT_REQUESTS=1000
URL="http://localhost:3000/user"

make_request() {
  curl -s -o /dev/null -w "%{http_code}\n" -H "Authorization: $TOKEN" "$URL"
}

# Export the function to be used by xargs
export -f make_request
export TOKEN
export URL

# Run 1000 concurrent requests
seq $CONCURRENT_REQUESTS | xargs -n1 -P1000 bash -c 'make_request'
