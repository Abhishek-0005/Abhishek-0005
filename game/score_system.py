class ScoreSystem:
    def __init__(self):
        self.score = 0

    def display_score(self):
        print(f"Current Score: {self.score}")

    def increase_score(self, points):
        self.score += points
        self.display_score()

# Example of how to use the ScoreSystem
if __name__ == '__main__':
    score_system = ScoreSystem()
    # Simulating a successful action
    score_system.increase_score(10)  # Increases score by 10
