"""Test isolation: point the app at a throwaway temp database.

conftest.py is imported before test modules (which import `main`),
so DATABASE_URL is already set when the SQLAlchemy engine is created.
"""

import os
import tempfile
from pathlib import Path

TEST_DB_DIR = Path(tempfile.mkdtemp(prefix="sdp_test_"))
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_DIR / 'test.db'}"
