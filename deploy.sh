#!/bin/bash
# Publish web/ to the gh-pages branch as a SINGLE commit, as for spex, ismex, lensex,
# ionbal and dustex: the branch is rebuilt from scratch and force-pushed on every deploy.
# What ships is web/ as committed at HEAD (never the working copy), and only after the
# physics checks (validate.js) pass; a web/ with uncommitted or untracked changes is refused.
#
#   ./deploy.sh
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
BRANCH=gh-pages
cd "$HERE"
git rev-parse --git-dir > /dev/null 2>&1 || { echo "not a git repository"; exit 1; }
git remote get-url origin > /dev/null 2>&1 || { echo "no 'origin' remote"; exit 1; }
git cat-file -e HEAD:web/index.html 2> /dev/null || { echo "no web/index.html at HEAD"; exit 1; }
git cat-file -e HEAD:web/.nojekyll 2> /dev/null || { echo "web/.nojekyll missing at HEAD"; exit 1; }
if [ -n "$(git status --porcelain -- web)" ]; then
  echo "web/ has uncommitted or untracked changes; commit them (or stash) first:"
  git status --short -- web
  exit 1
fi

# the physics checks (spectrograph and imager), against the committed engines
node validate.js > /dev/null || { echo "validate.js failed; not deploying (run: node validate.js)"; exit 1; }
node validate_img.js > /dev/null || { echo "validate_img.js failed; not deploying (run: node validate_img.js)"; exit 1; }

# Build on a throwaway branch and push it to gh-pages by refspec; clean up however this exits.
TMP=$(mktemp -d)
SCRATCH="deploy-$$"
cleanup() {
  git -C "$HERE" worktree remove --force "$TMP" 2> /dev/null || rm -rf "$TMP"
  git -C "$HERE" worktree prune 2> /dev/null || true
  git -C "$HERE" branch -qD "$SCRATCH" 2> /dev/null || true
}
trap cleanup EXIT
git worktree add --detach -q "$TMP"
V=$(git rev-parse --short HEAD)
(
  cd "$TMP"
  git checkout -q --orphan "$SCRATCH"
  git rm -rqf . 2> /dev/null || true
  git -C "$HERE" archive HEAD:web | tar -x -C "$TMP"
  rm -f serve.py
  # Pages caches index.html and each script independently for ten minutes, so
  # new HTML could run against an old script.  Stamping the commit onto every
  # asset URL makes new HTML always ask for URLs it has never seen.
  for f in app.js physics.js presets.js imager.js ipresets.js imgapp.js tpresets.js tpupil.js telapp.js; do
    sed -i '' -e "s|src=\"$f\"|src=\"$f?v=$V\"|" index.html
    grep -q "$f?v=" index.html || { echo "asset stamping failed for $f"; exit 1; }
  done
  sed -i '' -e "s|href=\"style.css\"|href=\"style.css?v=$V\"|" index.html
  grep -q "style.css?v=" index.html || { echo "asset stamping failed for style.css"; exit 1; }
  git add -A
  git commit -q -m "site $(date -u '+%Y-%m-%d %H:%M UTC') from $V"
  git push -f -q origin "HEAD:$BRANCH"
)
echo "pushed $BRANCH from $V ($(git ls-tree -r -l HEAD:web | awk '{s += $4} END {printf "%.0f kB", s / 1024}'))"
