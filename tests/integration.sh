#!/bin/bash
set -e

API_URL="${API_URL:-http://localhost:4036/api}"
PASS=0
FAIL=0

assert_status() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [ "$actual" -eq "$expected" ]; then
    echo "✅ $name (HTTP $actual)"
    PASS=$((PASS + 1))
  else
    echo "❌ $name (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== LensPulse Integration Tests ==="
echo "API: $API_URL"
echo ""

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
assert_status "Health Check" 200 "$HTTP_CODE"

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@kadikoyoptik.com","password":"demo123456"}')
HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')
assert_status "Login" 200 "$HTTP_CODE"

TOKEN=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "❌ Could not extract token"
  exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats" -H "Authorization: Bearer $TOKEN")
assert_status "Dashboard Stats" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/customers" -H "Authorization: Bearer $TOKEN")
assert_status "List Customers" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/appointments" -H "Authorization: Bearer $TOKEN")
assert_status "List Appointments" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/orders" -H "Authorization: Bearer $TOKEN")
assert_status "List Orders" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/prescriptions" -H "Authorization: Bearer $TOKEN")
assert_status "List Prescriptions" 200 "$HTTP_CODE"

CREATE_CUSTOMER=$(curl -s -w "\n%{http_code}" "$API_URL/customers" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Deniz","lastName":"Koç","phone":"0544 999 88 77","city":"İstanbul"}')
HTTP_CODE=$(echo "$CREATE_CUSTOMER" | tail -1)
assert_status "Create Customer" 201 "$HTTP_CODE"

CUSTOMER_ID=$(echo "$CREATE_CUSTOMER" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$CUSTOMER_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/customers/$CUSTOMER_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"notes":"İlk ziyaret"}')
  assert_status "Update Customer" 200 "$HTTP_CODE"

  CREATE_APPT=$(curl -s -w "\n%{http_code}" "$API_URL/appointments" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -d "{\"date\":\"2027-02-15T10:00:00Z\",\"type\":\"exam\",\"customerId\":\"$CUSTOMER_ID\"}")
  APPT_CODE=$(echo "$CREATE_APPT" | tail -1)
  assert_status "Create Appointment" 201 "$APPT_CODE"

  APPT_ID=$(echo "$CREATE_APPT" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

  if [ -n "$APPT_ID" ]; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/appointments/$APPT_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -X DELETE)
    assert_status "Delete Appointment" 200 "$HTTP_CODE"
  fi

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/customers/$CUSTOMER_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Customer" 200 "$HTTP_CODE"
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats")
assert_status "Unauthorized Access" 401 "$HTTP_CODE"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
