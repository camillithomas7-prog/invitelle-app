import subprocess, os
from concurrent.futures import ThreadPoolExecutor
B="Flat top-down macro photograph of a sheet of luxury wedding stationery paper filling the entire frame edge to edge, seamless tileable texture, even soft lighting with no shadows and no vignette, pure white or off-white only (white on white, no colors, no gold), no objects, no text, no edges, no folds."
J={'liscia':'Smooth heavy cotton paper with a very fine subtle grain.',
 'floreale':'Paper blind-embossed all over with roses and leaves in relief.',
 'lino':'Fine linen-textured paper with a visible woven canvas pattern.',
 'sfrangiato':'Thick handmade cotton rag paper with visible fibers and gentle irregularities.',
 'artdeco':'Paper blind-embossed with a repeating Art Deco geometric fan pattern in relief.',
 'pizzo':'Paper blind-embossed with a delicate bridal lace pattern in relief.',
 'ulivo':'Paper blind-embossed with olive branches and leaves in relief.',
 'perlata':'Smooth pearlescent shimmer paper with a soft satin pearl sheen.',
 'fiori-secchi':'Handmade paper with tiny pressed white dried flowers and petals embedded in the fibers.'}
def run(k):
    out=f'public/media/envelopes/paper/{k}.png'
    r=subprocess.run(['./gen.sh',out,'gpt_image_2','--prompt',B+' '+J[k],'--aspect_ratio','1:1','--resolution','2k'],capture_output=True,text=True)
    return r.stdout.strip()[:90] or r.stderr[:200]
with ThreadPoolExecutor(9) as ex:
    for r in ex.map(run,J): print(r,flush=True)
