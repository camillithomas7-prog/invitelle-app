#!/bin/bash
# Avvia Invitelle in locale (limiti upload alzati per MP3 e foto)
cd "$(dirname "$0")"
php -d upload_max_filesize=600M -d post_max_size=620M -d max_execution_time=600 -d max_input_time=600 -d memory_limit=256M -S localhost:8486 -t public router.php
