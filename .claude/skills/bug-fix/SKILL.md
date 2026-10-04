---
name: bug-fix
description: "Playbook for a reported defect: reproduce it, root-cause it, and fix it with runtime evidence. Use for /bug-fix or when asked to fix a bug rigorously."
disable-model-invocation: true
---

# Bug fix

Adapted from the pstack bug-fix playbook (MIT, see `../PSTACK-LICENSE`).

**You own this task. Plan, review, verify.**

Be scientific. Every shipped line traces to runtime evidence. Belt-and-suspenders that "might help" is a hypothesis, not a fix. It does not ship. When evidence refutes a hypothesis, revert what it motivated. The smallest change the evidence justifies ships, nothing more.

1. Reproduce it yourself on the matching surface, using the project's `verify-*` skill when one exists. Ask the user only with a stated, specific reason the surface cannot be reached, and only after driving it as far as it goes. If it won't reproduce directly, synthesize the trigger, tighten conditions, or instrument until it fires. The app's envs point at the production Convex deployment, so never reproduce by writing to it. Use an in-memory or mocked database, or the dev deployment.
2. Binary-search the cause. Form the candidate hypotheses, then rule them out until one survives. Seed them by reading the affected subsystem and its git history. Each pass, take the split that cuts the most remaining problem space, get runtime evidence, eliminate. When program state is unclear, add instrumentation or logging and read it as the code runs. Don't guess. Confirm the surviving *mechanism* with runtime evidence before planning the fix.
3. Plan the fix. If it crosses a function boundary, settle the caller's usage and the types first. For a risky fix, run the **blast-radius** skill before merging and the **interrogate** skill on the diff.
4. Verify on the same surface. The original repro now passes. "Inconclusive" or wrong-surface is not a pass. Flag it. Unit tests show branch behavior, not bug absence.
5. Stage the commits so the failing repro lands before the fix in git history. See the **tdd** skill for the failing-test-first cadence when the bug has a cheap local test path. Skip it when the test would be expensive, integration-heavy, or unclear.

**Reply:** what was broken, root cause, fix, how you verified. Paste failing-then-passing repro output verbatim.
