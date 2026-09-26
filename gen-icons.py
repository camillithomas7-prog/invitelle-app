# Genera le icone a linea in parallelo (12 alla volta), salta quelle già presenti
import subprocess, os
from concurrent.futures import ThreadPoolExecutor
jobs = [l.rstrip('\n').split('\t') for l in open('/tmp/icon-jobs.txt')]
def run(j):
    out, prompt = j
    if os.path.exists(out) and os.path.getsize(out) > 1000: return f'gia {out}'
    for _ in range(2):
        r = subprocess.run(['./gen.sh', out, 'gpt_image_2', '--prompt', prompt, '--aspect_ratio', '1:1'], capture_output=True, text=True)
        if os.path.exists(out) and os.path.getsize(out) > 1000: return r.stdout.strip()[:80]
    return 'FAIL ' + out
with ThreadPoolExecutor(12) as ex:
    for r in ex.map(run, jobs): print(r, flush=True)
