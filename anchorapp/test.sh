yarn tsc ./tests/utils.ts
node fileclient.js
diff testfile testfile.out > /dev/null
if [ $? -ne 0 ]; then
    echo "Error: files don't match"
fi