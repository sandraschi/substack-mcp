"""CUA Headless Smoke Test for substack-mcp endpoints."""

import sys

import httpx


def test_endpoints():
    base_url = "http://127.0.0.1:11163"
    print(f"Testing backend health at {base_url}/health ...")

    with httpx.Client(timeout=5.0) as client:
        try:
            r = client.get(f"{base_url}/health")
            if r.status_code == 200:
                print("✓ Health check OK:", r.json())
            else:
                print("✗ Health check failed with status:", r.status_code)
                sys.exit(1)

            # Test settings API
            r = client.get(f"{base_url}/api/settings")
            if r.status_code == 200:
                print("✓ Settings API OK:", r.json().get("llm_provider"))
            else:
                print("✗ Settings API failed:", r.status_code)
                sys.exit(1)

            print("✓ CUA Smoke Test PASSED cleanly!")
        except Exception as e:
            print("✗ Connection error (ensure server is running on 11163):", e)
            sys.exit(1)


if __name__ == "__main__":
    test_endpoints()
