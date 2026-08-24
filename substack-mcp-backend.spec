# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec — produce substack-mcp-backend.exe for Tauri NSIS embedding.
# Usage:
#   uv run pyinstaller substack-mcp-backend.spec --distpath dist --clean --noconfirm

block_cipher = None

a = Analysis(
    ["substack_mcp/server.py"],
    pathex=["."],
    binaries=[],
    datas=[("substack_mcp", "substack_mcp")],
    hiddenimports=[
        "uvicorn.logging",
        "uvicorn.loops",
        "uvicorn.loops.asyncio",
        "uvicorn.protocols",
        "uvicorn.protocols.http",
        "uvicorn.protocols.http.httptools_impl",
        "uvicorn.protocols.http.h11_impl",
        "uvicorn.lifespan",
        "uvicorn.lifespan.on",
        "h11",
        "sqlite3",
        "feedparser",
        "beautifulsoup4",
        "bs4",
        "markdown",
        "fastmcp",
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=["tkinter", "setuptools", "pip", "wheel", "test", "tests", "unittest"],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=True,
)

_keep_dist = ["fastmcp-", "fastmcp_slim-", "mcp-"]
_saved = [
    e for e in a.datas
    if isinstance(e, tuple) and any(k in str(e[0]) for k in _keep_dist) and ".dist-info" in str(e[0])
]
for _list in [a.datas, a.binaries, a.zipfiles, a.scripts]:
    _list[:] = [e for e in _list if not (isinstance(e, tuple) and ".dist-info" in str(e[0]))]
a.datas.extend(_saved)

SKIP = ["torch", "playwright", "matplotlib", "PIL", "pandas", "scipy", "sklearn"]
a.binaries = [b for b in a.binaries if not any(s in b[0].lower() for s in SKIP)]

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name="substack-mcp-backend",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
)
