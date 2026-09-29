# Score System Implementation

class Score:
    def __init__(self):
        self.score = 0

    def add_points(self, points):
        self.score += points

    def reset_score(self):
        self.score = 0

    def get_score(self):
        return self.score

# Example usage
if __name__ == '__main__':
    score_system = Score()
    score_system.add_points(10)
    print(f"Current Score: {score_system.get_score()}")