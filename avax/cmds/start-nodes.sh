curl -X POST -k http://localhost:8081/v1/control/start -d '{"execPath":"'${AVALANCHEGO_EXEC_PATH}'","numNodes":5,"logLevel":"INFO"}'
if [[ $? -ne 0 ]]; then
    echo "Error initializing nodes"
    exit 1
fi