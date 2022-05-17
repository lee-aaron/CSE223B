USERNAME='hackerry'
PASSWORD='j_qQS^Rsu9X*?Y\\ZrQT&U=H&9u8#w_j'
NODEPORT='65285'
OUTPUTFI="output"

check_error () {
    if [[ $1 -ne 0 ]]; then
        cat ${OUTPUTFI}
        echo "Error: $2"
        exit 1
    fi
}

curl --location --request POST "127.0.0.1:${NODEPORT}/ext/keystore" \
--header 'Content-Type: application/json' \
--data-raw "{
    \"jsonrpc\":\"2.0\",
    \"id\"     :1,
    \"method\" :\"keystore.createUser\",
    \"params\" :{
        \"username\": \"${USERNAME}\",
        \"password\": \"${PASSWORD}\"
    }
}" -o ${OUTPUTFI} -s
grep '"success":true' ${OUTPUTFI} > /dev/null
check_error $? 'Create user'

curl --location --request POST "127.0.0.1:${NODEPORT}/ext/bc/X" \
--header 'Content-Type: application/json' \
--data-raw "{
    \"jsonrpc\":\"2.0\",
    \"id\"     :1,
    \"method\" :\"avm.importKey\",
    \"params\" :{
        \"username\": \"${USERNAME}\",
        \"password\": \"${PASSWORD}\",
        \"privateKey\":\"PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN\"
    }
}" -o ${OUTPUTFI} -s
grep '"address":' ${OUTPUTFI} > /dev/null
check_error $? 'Fund user'

curl -X POST --data "{
    \"jsonrpc\": \"2.0\",
    \"method\": \"platform.createAddress\",
    \"params\": {
        \"username\":\"${USERNAME}\",
        \"password\":\"${PASSWORD}\"
    },
    \"id\": 1
}" -H 'content-type:application/json;' 127.0.0.1:${NODEPORT}/ext/bc/P -o ${OUTPUTFI} -s
ADDRESS=`grep -Po '"address":"\K.*?(?=")"' ${OUTPUTFI}`
check_error $? 'Create address'
echo "ADDRESS: " $ADDRESS

curl --location --request POST "127.0.0.1:${NODEPORT}/ext/bc/X" \
--header 'Content-Type: application/json' \
--data-raw "{
  \"jsonrpc\":\"2.0\",
  \"id\"     : 1,
  \"method\" :\"avm.getBalance\",
  \"params\" :{
      \"address\":\"X-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p\",
      \"assetID\": \"AVAX\"
  }
}" -o ${OUTPUTFI} -s
cat ${OUTPUTFI}