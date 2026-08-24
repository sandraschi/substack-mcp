# Troubleshooting Guide — `substack-mcp`

Common issues and step-by-step diagnostic procedures.

## 1. Diagnostics Check

Open the webapp dashboard (`http://127.0.0.1:11164`) and click **Help** &rarr; **Run Diagnostics**.
Check:
- API Health status (Port `11163`)
- Database connection status
- Substack Auth cookie badge
- Local LLM connection status

## 2. Common Issues

### Issue: 403 Forbidden when creating drafts
- **Cause**: Missing or expired `substack.sid` session cookie.
- **Fix**: Update your `substack.sid` session cookie in **Settings**.

### Issue: Local LLM Timeout / Connection Error
- **Cause**: Ollama or LM Studio is not running locally.
- **Fix**: Verify Ollama is running (`ollama serve`) and test connection in **Settings**.

### Issue: Port 11163 or 11164 in use
- **Cause**: Zombie process holding the port.
- **Fix**: Run `.\start.ps1`, which automatically detects and kills zombie processes before binding.
