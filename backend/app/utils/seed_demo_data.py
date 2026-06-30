import argparse
from datetime import UTC, datetime

from app.database import SessionLocal
from app.services import DemoSeedResetRequiredError, seed_demo_data


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Seed local AgentOps demo data.",
    )
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Delete known demo rows before recreating them.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview what would happen without writing to the database.",
    )
    parser.add_argument(
        "--trace-limit",
        type=int,
        default=None,
        help="Seed only the first N demo traces.",
    )
    parser.add_argument(
        "--base-time",
        type=str,
        default=None,
        help="Use a fixed ISO datetime as the seed reference time.",
    )
    return parser.parse_args()


def parse_base_time(value: str | None) -> datetime | None:
    if value is None:
        return None

    parsed = datetime.fromisoformat(value)

    if parsed.tzinfo is None:
        raise ValueError("base-time must include timezone information.")

    return parsed.astimezone(UTC)


def print_summary(summary) -> None:
    if summary.dry_run:
        if summary.found_existing_data:
            print(
                "Dry run: demo data already exists and would require --reset "
                "to replace."
            )
        else:
            print("Dry run: demo data would be created.")

        print(
            "Planned demo data: "
            f"{summary.agents} agents, "
            f"{summary.traces} traces, "
            f"{summary.spans} spans, "
            f"{summary.evaluations} evaluations."
        )
        return

    if summary.reset_performed:
        print("Existing demo data was reset and recreated.")
    elif summary.found_existing_data:
        print("Demo data already existed and was reused.")
    else:
        print("Demo data was created.")

    print(
        "Seeded demo data: "
        f"{summary.agents} agents, "
        f"{summary.traces} traces, "
        f"{summary.spans} spans, "
        f"{summary.evaluations} evaluations."
    )


def main() -> None:
    args = parse_args()

    if args.trace_limit is not None and args.trace_limit <= 0:
        raise SystemExit("trace-limit must be greater than 0.")

    try:
        base_time = parse_base_time(args.base_time)
    except ValueError as error:
        raise SystemExit(f"Invalid --base-time: {error}") from error

    db = SessionLocal()

    try:
        try:
            summary = seed_demo_data(
                db,
                reset=args.reset,
                dry_run=args.dry_run,
                trace_limit=args.trace_limit,
                base_time=base_time,
            )
        except DemoSeedResetRequiredError as error:
            raise SystemExit(error.detail) from error
    finally:
        db.close()

    print_summary(summary)


if __name__ == "__main__":
    main()