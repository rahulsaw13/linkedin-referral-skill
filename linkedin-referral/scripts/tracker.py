#!/usr/bin/env python3
"""Tracker for the linkedin-referral skill / agent.

Keeps linkedin_tracker.csv (one row per job x person x action) and prints
what needs doing next. Standard library only.

Usage (run from the job-hunt directory, or pass --file):
  tracker.py init
  tracker.py add --company Intel --role "AI Engineer" --job-url URL [--salary unverified]
                 [--fit 5] [--person NAME] [--person-title T] [--profile-url URL]
                 [--action shortlisted] [--status pending] [--notes "..."]
  tracker.py update --company Intel --person "Suresh Checka" --action connect_sent --status pending_accept
  tracker.py list [--action connect_sent]
  tracker.py due              # follow-ups due today, by age of the last action
  tracker.py count "note text" [--limit 200]
"""
import argparse
import csv
import datetime as dt
import os
import sys

HEADER = ["date", "company", "role", "job_url", "salary", "fit", "person",
          "person_title", "profile_url", "action", "status", "notes"]
ACTIONS = {"shortlisted", "drafted", "connect_sent", "message_sent", "followup_sent",
           "applied", "referred", "not_sent", "skipped"}
FOLLOW_UP_DAYS = 4   # accepted, no reply -> nudge once
BACKUP_DAYS = 7      # invite not accepted -> withdraw, try the backup person


def load(path):
    if not os.path.exists(path):
        return []
    with open(path, encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f, restkey="_extra"))
    for r in rows:
        # A hand-edited row with an unquoted comma yields extra fields; fold
        # them back into notes instead of failing on save.
        extra = r.pop("_extra", None)
        if extra:
            r["notes"] = ",".join([r.get("notes") or ""] + extra)
        for k in HEADER:
            if r.get(k) is None:
                r[k] = ""
    return rows


def save(path, rows):
    # Write to a temp file and rename, so a failure never truncates the tracker.
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=HEADER)
        w.writeheader()
        w.writerows(rows)
    os.replace(tmp, path)


def cmd_init(a):
    if os.path.exists(a.file):
        print(f"{a.file} already exists")
        return
    save(a.file, [])
    print(f"created {a.file}")


def cmd_add(a):
    if a.action not in ACTIONS:
        sys.exit(f"action must be one of {sorted(ACTIONS)}")
    rows = load(a.file)
    rows.append({
        "date": a.date or dt.date.today().isoformat(), "company": a.company, "role": a.role,
        "job_url": a.job_url or "", "salary": a.salary or "", "fit": a.fit or "",
        "person": a.person or "", "person_title": a.person_title or "",
        "profile_url": a.profile_url or "", "action": a.action, "status": a.status,
        "notes": a.notes or "",
    })
    save(a.file, rows)
    print("added")


def cmd_update(a):
    rows = load(a.file)
    hit = 0
    for r in rows:
        if r["company"].lower() != a.company.lower():
            continue
        if a.person and r["person"].lower() != a.person.lower():
            continue
        if a.action:
            r["action"] = a.action
            r["date"] = dt.date.today().isoformat()
        if a.status:
            r["status"] = a.status
        if a.notes:
            r["notes"] = (a.notes + "; " + r["notes"]).strip("; ")
        hit += 1
    save(a.file, rows)
    print(f"updated {hit} row(s)")


def cmd_list(a):
    for r in load(a.file):
        if a.action and r["action"] != a.action:
            continue
        print(f'{r["date"]} | {r["company"]} | {r["role"]} | {r["person"] or "-"} | '
              f'{r["action"]} | {r["status"]} | fit {r["fit"] or "-"}')


def cmd_due(a):
    today = dt.date.today()
    for r in load(a.file):
        try:
            age = (today - dt.date.fromisoformat(r["date"])).days
        except ValueError:
            continue
        who = f'{r["person"]} ({r["company"]} - {r["role"]})'
        if r["action"] == "connect_sent" and r["status"] == "pending_accept":
            if age >= BACKUP_DAYS:
                print(f"BACKUP   {who}: invite {age}d old, withdraw and contact the backup")
            else:
                print(f"CHECK    {who}: invite {age}d old, see if it was accepted")
        elif r["action"] in ("message_sent",) and r["status"] in ("pending_reply", "accepted"):
            if age >= FOLLOW_UP_DAYS:
                print(f"NUDGE    {who}: no reply for {age}d, send one short follow-up")
        elif r["status"] == "accepted":
            print(f"MESSAGE  {who}: accepted, send the follow-up with the company link")


def cmd_count(a):
    n = len(a.text)
    print(f"{n}/{a.limit}" + ("  TOO LONG" if n > a.limit else ""))


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--file", default="linkedin_tracker.csv")
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("init")
    ad = sub.add_parser("add")
    for flag in ("company", "role"):
        ad.add_argument(f"--{flag}", required=True)
    for flag in ("job-url", "salary", "fit", "person", "person-title", "profile-url", "notes", "date"):
        ad.add_argument(f"--{flag}")
    ad.add_argument("--action", default="shortlisted")
    ad.add_argument("--status", default="pending")
    up = sub.add_parser("update")
    up.add_argument("--company", required=True)
    for flag in ("person", "action", "status", "notes"):
        up.add_argument(f"--{flag}")
    ls = sub.add_parser("list")
    ls.add_argument("--action")
    sub.add_parser("due")
    ct = sub.add_parser("count")
    ct.add_argument("text")
    ct.add_argument("--limit", type=int, default=200)
    a = p.parse_args()
    {"init": cmd_init, "add": cmd_add, "update": cmd_update, "list": cmd_list,
     "due": cmd_due, "count": cmd_count}[a.cmd](a)


if __name__ == "__main__":
    main()
