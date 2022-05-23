check_error () {
    if [ $1 -ne 0 ]; then
        cat ${OUTPUTFI}
        echo "Error: $2"
        exit 1
    fi
}

# Install yarn and anchor
npm install -g yarn
npm i -g @project-serum/anchor-cli

# Check yarn and anchor installed
which yarn
check_error $? 'yarn not found'
which anchor
check_error $? 'anchor not found'

# Build repo
anchor build