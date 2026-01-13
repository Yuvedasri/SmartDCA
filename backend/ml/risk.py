# Enterprise-Style Risk Modeling:
# This function estimates a risk score for overdue amounts based on days overdue and amount. 
# It uses rule-based scoring similar to frameworks used in financial enterprises for risk quantification.
# Scoring is additive and each risk factor (delay, high amount) increases the risk score.
# The final score is always between 1 (lowest risk) and 10 (highest risk).

def compute_risk_score(amount: float, days_overdue: int) -> int:
    """
    Calculate a risk score for overdue financial cases.

    Risk modeling approach:
    - Score = 1 + (1 per 15 days overdue) + (1 per 10000 in amount)
    - Score is capped at 10
    - This mimics tiered, rule-based scoring in enterprise lending and collections.

    Args:
        amount (float): The overdue monetary amount.
        days_overdue (int): Number of days overdue.

    Returns:
        int: Risk score in range [1, 10]
    """
    score = 1

    # Add 1 point for every 15 days overdue
    score += days_overdue // 15

    # Add 1 point for every 10000 in amount
    score += int(amount // 10000)
    
    # Cap the score to 10 as per enterprise standards
    score = min(score, 10)

    return int(score)
