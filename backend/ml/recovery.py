def predict_recovery_probability(amount: float, days_overdue: int) -> int:
    """
    Estimate the probability (in %) of successfully recovering an overdue amount.

    This function uses a simple heuristic inspired by how basic machine learning models
    might weigh input features:

    - Start with a base probability of 80%.
    - Subtract 1% for every 2 days overdue.
    - Subtract 1% for every 5000 of overdue amount.
    - Clamp the predicted probability between 5% and 95%.

    Args:
        amount (float): The monetary amount overdue.
        days_overdue (int): Number of days the amount is overdue.

    Returns:
        int: The estimated probability in percentage (5-95).
    """
    base = 80
    penalty_days = days_overdue // 2   # Each 2 days = 1% penalty
    penalty_amount = int(amount // 5000)  # Each 5000 = 1% penalty
    probability = base - penalty_days - penalty_amount
    # Clamp between 5 and 95
    probability = max(5, min(95, probability))
    return int(probability)
