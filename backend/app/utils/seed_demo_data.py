from app.database import SessionLocal
from app.services import seed_demo_data


def main() -> None:
    db = SessionLocal()

    try:
        summary = seed_demo_data(db)
    finally:
        db.close()

    print(
        "Seeded demo data: "
        f"{summary.agents} agents, "
        f"{summary.traces} traces, "
        f"{summary.spans} spans, "
        f"{summary.evaluations} evaluations."
    )


if __name__ == "__main__":
    main()
