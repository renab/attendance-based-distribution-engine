# Windows
Get the appropriate vault key: 

`npx dotenv-vault@latest keys production` or `npx dotenv-vault@latest keys development`

pass it to dockercompose:
    
`set DOTENV_KEY="your-key-here"; docker-compose up -d` for production or `set DOTENV_KEY="your-key-here"; docker-compose -f docker-copmpose.dev.yaml up -d`

# Linux
Get the appropriate vault key: 

`npx dotenv-vault@latest keys production` or `npx dotenv-vault@latest keys development`

pass it to dockercompose:
    
`export DOTENV_KEY="your-key-here"; docker-compose up -d` for production or `export DOTENV_KEY="your-key-here"; docker-compose -f docker-copmpose.dev.yaml up -d`