import os
import ssl
import cups

def get_asyncpg_connection_params():
        """
        Build asyncpg connection parameters from environment variables.
        Supports SSL if DB_SSLMODE is set.
        """
        sslmode = os.getenv('DB_SSLMODE', 'disable').lower()

        # Prepare SSL context if needed
        ssl_ctx = None
        if sslmode != 'disable':
            if sslmode in ('require', 'prefer'):
                # Basic SSL verification, default context
                ssl_ctx = True
            elif sslmode == 'verify-full':
                ssl_ctx = ssl.create_default_context(
                    cafile=os.getenv('DB_SSLROOTCERT')
                )
                certfile = os.getenv('DB_SSLCERT')
                keyfile = os.getenv('DB_SSLKEY')
                if certfile and keyfile:
                    ssl_ctx.load_cert_chain(certfile=certfile, keyfile=keyfile)
            else:
                raise ValueError(f"Unsupported DB_SSLMODE: {sslmode}")
        

        return {
            'host': os.getenv('DB_HOST', 'localhost'),
            'port': int(os.getenv('DB_PORT', 5432)),
            'database': os.getenv('DB_NAME', 'crypto_pipeline'),
            'user': os.getenv('DB_USER', 'admin'),
            'password': os.getenv('DB_PASSWORD', 'adminpassword'),
            'ssl': ssl_ctx,
            'min_size': int(os.getenv('DB_POOL_MIN', 5)),
            'max_size': int(os.getenv('DB_POOL_MAX', 10)),
        }


def create_cups_connection():
    url = os.getenv("CUPS_SERVER_URL", "localhost:631")
    user = os.getenv("CUPS_USER", "root")
    password = os.getenv("CUPS_PASSWORD", "")

    cups.setUser(user)
    
    # This form is more reliable than a lambda for blocking admin calls
    def password_cb(prompt):
        return password
    
    cups.setPasswordCB(password_cb)

    if ":" in url:
        host, port = url.rsplit(":", 1)
        conn = cups.Connection(host=host, port=int(port))
    else:
        conn = cups.Connection(host=url)

    return conn