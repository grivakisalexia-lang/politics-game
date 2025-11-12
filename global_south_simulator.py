"""Reigns-style text game about global south dependence."""
from __future__ import annotations

import random
from dataclasses import dataclass, field
from typing import Dict, List, Tuple


Metric = Dict[str, int]


@dataclass
class Option:
    label: str
    description: str
    effects: Metric
    explanation: str


@dataclass
class EventCard:
    name: str
    prompt: str
    context: str
    options: Tuple[Option, Option]


@dataclass
class GameState:
    metrics: Metric = field(default_factory=lambda: {
        "Public Support": 50,
        "Treasury": 50,
        "Sovereignty": 50,
        "Environment": 50,
    })
    turn: int = 0
    history: List[str] = field(default_factory=list)

    def apply_effects(self, option: Option) -> None:
        for key, delta in option.effects.items():
            self.metrics[key] = max(0, min(100, self.metrics[key] + delta))
        self.turn += 1
        summary = f"Turn {self.turn}: {option.label} — {option.description}\n{option.explanation}"
        self.history.append(summary)

    def is_game_over(self) -> Tuple[bool, str]:
        for metric, value in self.metrics.items():
            if value <= 0:
                return True, f"Your {metric.lower()} collapsed, triggering a political crisis."
            if value >= 100:
                return True, f"Your {metric.lower()} ballooned unsustainably, causing imbalance elsewhere."
        if self.turn >= 24:
            return True, "After years of tough choices, you reach the end of your mandate."
        return False, ""


def create_deck() -> List[EventCard]:
    return [
        EventCard(
            name="Development Loan",
            prompt="A multilateral bank offers a massive infrastructure loan with low interest, but strict procurement rules.",
            context=(
                "Global South nations often rely on external loans for development, which can lock them into debt "
                "and vendor agreements favoring foreign firms."
            ),
            options=(
                Option(
                    label="Accept",
                    description="Sign the loan agreement and fast-track the project.",
                    effects={"Treasury": 12, "Public Support": 6, "Sovereignty": -10},
                    explanation=(
                        "The loan boosts cash flow and wins public favor, but procurement conditions mean foreign "
                        "contractors dominate, eroding local control."
                    ),
                ),
                Option(
                    label="Decline",
                    description="Reject the offer and seek domestic alternatives.",
                    effects={"Treasury": -8, "Public Support": -4, "Sovereignty": 6},
                    explanation=(
                        "Turning down the loan keeps policy space intact but leaves immediate needs unfunded, "
                        "angering constituents."
                    ),
                ),
            ),
        ),
        EventCard(
            name="Commodity Shock",
            prompt="Global prices for your main export commodity have plunged.",
            context=(
                "Commodity dependence exposes countries to price volatility, often controlled by market actors in the North."
            ),
            options=(
                Option(
                    label="Subsidize",
                    description="Use reserves to subsidize farmers and miners.",
                    effects={"Treasury": -12, "Public Support": 8, "Environment": -6},
                    explanation=(
                        "Protecting livelihoods raises approval, yet propping up extraction delays diversification and strains ecosystems."
                    ),
                ),
                Option(
                    label="Diversify",
                    description="Let weak firms fail and invest in new green industries.",
                    effects={"Treasury": -6, "Public Support": -6, "Environment": 10, "Sovereignty": 4},
                    explanation=(
                        "Short-term pain angers workers, but green investments reduce future dependence and improve bargaining power."
                    ),
                ),
            ),
        ),
        EventCard(
            name="Military Aid",
            prompt="A powerful ally offers military training and equipment in exchange for base access.",
            context=(
                "Security aid can stabilize governments but often cements external influence in domestic affairs."
            ),
            options=(
                Option(
                    label="Allow",
                    description="Approve the base and accept the equipment.",
                    effects={"Public Support": -4, "Sovereignty": -12, "Treasury": 6},
                    explanation=(
                        "The infusion of hardware pleases the treasury but invites public criticism and limits strategic autonomy."
                    ),
                ),
                Option(
                    label="Refuse",
                    description="Deny access and pursue regional cooperation instead.",
                    effects={"Public Support": 4, "Sovereignty": 10, "Treasury": -6},
                    explanation=(
                        "Rejecting the offer appeases sovereignty advocates yet strains the budget as you fund local defense."
                    ),
                ),
            ),
        ),
        EventCard(
            name="Climate Loss & Damage",
            prompt="Floods devastate coastal communities. A global fund promises relief, but only if you adopt donor-designed reforms.",
            context=(
                "Climate finance is critical for vulnerable nations, yet conditionality can echo older structural adjustment programs."
            ),
            options=(
                Option(
                    label="Comply",
                    description="Accept the relief funds and adopt the reforms.",
                    effects={"Treasury": 14, "Environment": 6, "Sovereignty": -8},
                    explanation=(
                        "Communities recover faster, and environmental programs expand, but the imposed reforms limit domestic policy space."
                    ),
                ),
                Option(
                    label="Resist",
                    description="Reject the conditions and build a solidarity fund with neighbors.",
                    effects={"Treasury": -10, "Public Support": 6, "Sovereignty": 10},
                    explanation=(
                        "Regional solidarity protects autonomy and inspires citizens, yet the budget suffers without external relief."
                    ),
                ),
            ),
        ),
        EventCard(
            name="Tech Platform Expansion",
            prompt="A foreign tech giant wants exclusive rights to manage digital payments for your citizens.",
            context=(
                "Digital monopolies can entrench data extractivism, channeling profits abroad while shaping domestic markets."
            ),
            options=(
                Option(
                    label="Grant",
                    description="Approve the exclusive concession to accelerate digitization.",
                    effects={"Treasury": 8, "Public Support": 4, "Sovereignty": -10},
                    explanation=(
                        "Digital services roll out rapidly and people enjoy convenience, but control over data and standards moves offshore."
                    ),
                ),
                Option(
                    label="Regulate",
                    description="Impose data localization and open-access rules first.",
                    effects={"Treasury": -6, "Public Support": -2, "Sovereignty": 8},
                    explanation=(
                        "Negotiations slow adoption and frustrate users, yet the new rules preserve domestic leverage over the tech sector."
                    ),
                ),
            ),
        ),
        EventCard(
            name="Agro-Export Lobby",
            prompt="Agribusiness leaders demand new land concessions to expand cash crops for export.",
            context=(
                "Export-oriented agriculture can earn foreign currency but often displaces small farmers and harms ecosystems."
            ),
            options=(
                Option(
                    label="Approve",
                    description="Grant the concessions to boost exports.",
                    effects={"Treasury": 10, "Environment": -12, "Public Support": -4},
                    explanation=(
                        "Foreign exchange flows in, yet deforestation and rural displacement provoke discontent."
                    ),
                ),
                Option(
                    label="Protect",
                    description="Prioritize food sovereignty and support agroecology.",
                    effects={"Treasury": -4, "Environment": 12, "Public Support": 6},
                    explanation=(
                        "Community-centered farming gains momentum, but export revenue dips, tightening the budget."
                    ),
                ),
            ),
        ),
        EventCard(
            name="Debt Restructuring",
            prompt="Your debt payments are unsustainable. Creditors propose restructuring tied to austerity.",
            context=(
                "Debt workouts can ease pressure but often mandate cuts to social services, deepening inequality."
            ),
            options=(
                Option(
                    label="Accept",
                    description="Agree to the restructuring package and austerity plan.",
                    effects={"Treasury": 16, "Public Support": -10, "Sovereignty": -6},
                    explanation=(
                        "Bond markets calm and fiscal space opens, yet slashed services anger citizens and surrender policy freedom."
                    ),
                ),
                Option(
                    label="Default",
                    description="Suspend payments and renegotiate through a debtor coalition.",
                    effects={"Treasury": -14, "Public Support": 8, "Sovereignty": 12},
                    explanation=(
                        "Short-term capital flight hurts the treasury, but collective bargaining restores agency and public programs."
                    ),
                ),
            ),
        ),
        EventCard(
            name="Knowledge Exchange",
            prompt="A regional university alliance proposes a knowledge-sharing pact for homegrown innovation.",
            context=(
                "Building local research capacity counters brain drain and reduces dependence on imported technology."
            ),
            options=(
                Option(
                    label="Invest",
                    description="Fund the alliance and send scholars abroad for training.",
                    effects={"Treasury": -8, "Sovereignty": 6, "Public Support": 4},
                    explanation=(
                        "Scholarships cost money but cultivate local expertise, strengthening independent development paths."
                    ),
                ),
                Option(
                    label="Delay",
                    description="Postpone participation and focus on immediate needs.",
                    effects={"Treasury": 4, "Public Support": -4},
                    explanation=(
                        "Budget relief is welcome, yet innovation stagnates and reliance on foreign know-how persists."
                    ),
                ),
            ),
        ),
        EventCard(
            name="South-South Trade Bloc",
            prompt="Neighboring nations invite you to join a new trade bloc focused on regional value chains.",
            context=(
                "Regional integration can diversify trade partners and build resilience against core economies."
            ),
            options=(
                Option(
                    label="Join",
                    description="Sign the bloc treaty and harmonize tariffs.",
                    effects={"Treasury": 6, "Sovereignty": 6, "Public Support": 2},
                    explanation=(
                        "Tariff coordination brings new investment and strengthens bargaining power in global negotiations."
                    ),
                ),
                Option(
                    label="Decline",
                    description="Maintain existing bilateral deals with major powers.",
                    effects={"Treasury": 4, "Sovereignty": -6, "Public Support": -2},
                    explanation=(
                        "Status quo keeps certain partners content but perpetuates asymmetric trade relations."
                    ),
                ),
            ),
        ),
    ]


def render_meter(value: int) -> str:
    filled = int(value / 10)
    empty = 10 - filled
    return f"[{'█' * filled}{'.' * empty}] {value:>3}"


def display_state(state: GameState) -> None:
    print("\n================ YEAR", 2010 + state.turn, "================")
    print("Your mandate balances the needs of the people, the planet, and independence.\n")
    for metric, value in state.metrics.items():
        print(f"{metric:<16} {render_meter(value)}")


def choose_option(card: EventCard) -> Option:
    print("\n" + card.prompt)
    print("Context:", card.context)
    print("\nHow will you respond?")
    for idx, option in enumerate(card.options, start=1):
        print(f"  {idx}. {option.label}: {option.description}")

    while True:
        choice = input("Select 1 or 2 (or type 'c' to revisit context): ").strip().lower()
        if choice in {"1", "2"}:
            return card.options[int(choice) - 1]
        if choice == "c":
            print("\nContext reminder:")
            print(card.context)
            continue
        print("Please enter 1, 2, or 'c'.")


def conclude_game(state: GameState, reason: str) -> None:
    print("\n================ GAME OVER ================")
    print(reason)
    print("\nYour legacy:")
    for record in state.history:
        print("-", record)
    print("\nEach choice shaped the balance between development, autonomy, and justice. Reflect on the trade-offs and try again to explore alternate paths.")


def play_game() -> None:
    print("""
============================================================
        GLOBAL SOUTH LEADERSHIP SIMULATOR
============================================================
You are the elected leader of a Global South nation navigating structural
constraints and the pursuit of justice. Each year, swipe left or right—in
this text version, choose option 1 or 2—to respond to dilemmas. Keep your
society stable while reducing dependence on external powers.

Metrics:
  - Public Support: legitimacy at home.
  - Treasury: fiscal space for policy.
  - Sovereignty: policy autonomy and leverage.
  - Environment: ecological resilience.

Let no meter hit 0 or 100. Survive 24 turns to complete your mandate.
Type 'c' during a choice to reread the context.
Good luck!
""")
    deck = create_deck()
    random.shuffle(deck)
    state = GameState()

    while True:
        display_state(state)
        if not deck:
            deck = create_deck()
            random.shuffle(deck)
        card = deck.pop()
        option = choose_option(card)
        state.apply_effects(option)
        over, reason = state.is_game_over()
        if over:
            display_state(state)
            conclude_game(state, reason)
            break


if __name__ == "__main__":
    play_game()
