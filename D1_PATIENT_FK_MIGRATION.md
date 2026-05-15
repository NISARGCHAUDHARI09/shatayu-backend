# Cloudflare D1 Migration: Fix patient foreign key constraints for hard delete

This migration makes it safe to **hard delete** patients (remove rows from the `patients` table) without Cloudflare D1 throwing `foreign key mismatch` errors.

It does this by rebuilding a few tables **without foreign key constraints to `patients`**:

- `diagnosis`
- `draft_bills`
- `panchkarma_treatment_plan`

The application already deletes related rows manually in code before deleting a patient, so losing these FKs will not break functionality.

---

## 1. File to run

The SQL migration file is here:

- [backend/DB/migrations/20260107_fix_patient_fk_constraints.sql](backend/DB/migrations/20260107_fix_patient_fk_constraints.sql)

It will:

1. Turn off foreign key checks.
2. Recreate `diagnosis`, `draft_bills`, and `panchkarma_treatment_plan` tables **without** `FOREIGN KEY ... REFERENCES patients(id)`.
3. Copy all existing data into the new tables.
4. Drop the old tables and rename the new ones.
5. Turn foreign key checks back on.

---

## 2. Get your D1 database name and ID

From [wrangler.toml](wrangler.toml):

- `database_name = "shatayu_hospital_db"`
- `database_id = "2b3a4a38-e49d-4ea5-8e34-1dcdab001621"`

We will use `shatayu_hospital_db` and the `DB` binding in commands below.

---

## 3. Run the migration using Wrangler

Make sure you have Wrangler installed and logged in:

```bash
npm install -g wrangler
wrangler login
```

Then from the project root (where `wrangler.toml` is located), run:

```bash
wrangler d1 execute shatayu_hospital_db \
  --file=backend/DB/migrations/20260107_fix_patient_fk_constraints.sql
```

- `shatayu_hospital_db` comes from `database_name` in `wrangler.toml`.
- The `--file` path is relative to the root where you run the command.

If you want to see the SQL that will be run (dry-run) first:

```bash
wrangler d1 execute shatayu_hospital_db \
  --file=backend/DB/migrations/20260107_fix_patient_fk_constraints.sql \
  --dry-run
```

---

## 4. Verification after migration

After running the migration, you can verify:

1. Tables still exist and have data:

```bash
wrangler d1 execute shatayu_hospital_db --command="SELECT COUNT(*) AS cnt FROM diagnosis;"
wrangler d1 execute shatayu_hospital_db --command="SELECT COUNT(*) AS cnt FROM draft_bills;"
wrangler d1 execute shatayu_hospital_db --command="SELECT COUNT(*) AS cnt FROM panchkarma_treatment_plan;"
```

2. Foreign keys to `patients` are gone:

```bash
wrangler d1 execute shatayu_hospital_db --command="SELECT sql FROM sqlite_master WHERE type='table' AND name IN ('diagnosis','draft_bills','panchkarma_treatment_plan');"
```

You should **not** see any `FOREIGN KEY (... ) REFERENCES patients(id)` lines in the output.

---

## 5. Expected behavior after migration

After this migration and the new backend code:

- Deleting a patient from the OPD UI will:
  - Delete related rows in `diagnosis`, `draft_bills`, and `panchkarma_treatment_plan` (best effort).
  - Then delete the row from `patients`.
- Cloudflare D1 will **not** block this with `foreign key mismatch` errors.
- When a patient with OPD number (e.g. 11097) is deleted, that number becomes **available again** for a new patient.

If you like, you can run a small manual test after migration:

1. Create a test patient from the OPD form.
2. Add any related entries (diagnosis, draft bills, panchkarma) for that patient.
3. Delete the patient from OPD.
4. Confirm in D1 that the patient row is gone:

```bash
wrangler d1 execute shatayu_hospital_db --command="SELECT * FROM patients WHERE patient_id = '11097';"
```

and that no `foreign key mismatch` error occurs.
