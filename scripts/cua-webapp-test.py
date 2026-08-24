"""CUA Webapp Test Script for checking webapp availability on port 11164."""

import sys

import httpx


def test_webapp():
    web_url = "http://127.0.0.1:11164"
    print(f"Testing webapp frontend at {web_url} ...")

    with httpx.Client(timeout=5.0) as client:
        try:
            r = client.get(web_url)
            if r.status_code == 200 and '<div id="root">' in r.text:
                print("✓ Webapp HTML rendered OK on port 11164!")
            else:
                print(f"✗ Webapp test returned status {r.status_code}")
                sys.exit(1)
        except Exception as e:
            print("✗ Webapp connection error (ensure webapp is running on 11164):", e)
            sys.exit(1)


if __name__ == "__main__":
    test_webapp()
