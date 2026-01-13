def get_priority(amount: float, days_overdue: int) -> str:
    """
    Determine the priority of a case based on overdue amount and days.

    Args:
        amount (float): The monetary amount overdue.
        days_overdue (int): Number of days the amount is overdue.

    Returns:
        str: "High", "Medium", or "Low" indicating priority.
    """
    # High priority if either the overdue days exceed 60 or the amount exceeds 50,000
    if days_overdue > 60 or amount > 50000:
        return "High"
    # Medium priority if either the overdue days exceed 30 or the amount exceeds 20,000
    elif days_overdue > 30 or amount > 20000:
        return "Medium"
    # Otherwise, Low priority
    else:
        return "Low"
