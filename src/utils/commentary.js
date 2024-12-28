// src/utils/commentary.js

const HULK_TEMPLATES = {
    OPENING: {
      GOOD_MOVES: {
        DEVELOPMENT: [
          "HULK LIKE PIECE DEVELOPMENT! STRONG MOVE!",
          "YES! BRING OUT PIECES! MAKE HULK PROUD!"
        ],
        CENTER_CONTROL: [
          "HULK APPROVE! SMASH CENTER CONTROL!",
          "CENTER CONTROL MAKE POSITION STRONG! GOOD!"
        ],
        KING_SAFETY: [
          "CASTLE GOOD! PROTECT KING! HULK HAPPY!",
          "KING SAFE NOW! HULK LIKE SMART DEFENSE!"
        ]
      },
      VIOLATIONS: {
        EARLY_QUEEN: [
          "NO NO! QUEEN TOO EARLY MAKE HULK ANGRY! DEVELOP OTHER PIECES!",
          "BAD QUEEN MOVE! HULK SAY DEVELOP KNIGHTS AND BISHOPS FIRST!"
        ],
        EXCESSIVE_PAWNS: [
          "TOO MANY PAWN MOVES! HULK SAY DEVELOP PIECES!",
          "STOP PUSHING PAWNS! WHERE KNIGHTS AND BISHOPS?!"
        ],
        POOR_DEVELOPMENT: [
          "PIECES SLEEPING! HULK SAY WAKE THEM UP!",
          "WHY PIECES STILL HOME? HULK WANT ACTION!"
        ]
      }
    },
    MIDDLEGAME: {
      GOOD_MOVES: {
        ATTACK: [
          "HULK SEE GOOD ATTACK! KEEP PRESSURE!",
          "YES! PIECES WORK TOGETHER! CRUSH OPPONENT!"
        ],
        DEFENSE: [
          "GOOD DEFENSE! STAY STRONG!",
          "PROTECT POSITION! HULK APPROVE!"
        ]
      }
    },
    ENDGAME: {
      GOOD_MOVES: {
        KING_ACTIVITY: [
          "YES! KING MUST FIGHT IN ENDGAME!",
          "KING BECOME STRONG PIECE NOW! GOOD!"
        ],
        PAWN_ADVANCE: [
          "PUSH PAWN! MAKE NEW QUEEN!",
          "PAWNS MARCHING GOOD! HULK LIKE!"
        ]
      }
    }
  };
  
  export const generateHulkCommentary = (analysis) => {
    console.log('Generating commentary for:', analysis);
    const { phase, patterns, violations } = analysis;
    
    // Handle violations first
    if (violations.length > 0) {
        console.log('Found violations:', violations);
        const violation = violations[0];
        const templates = HULK_TEMPLATES[phase]?.VIOLATIONS?.[violation.type];
        if (templates) {
            return templates[Math.floor(Math.random() * templates.length)];
        }
    }
  
    // Handle good moves
    if (patterns.length > 0) {
      const pattern = patterns[0];
      const templates = HULK_TEMPLATES[phase]?.GOOD_MOVES?.[pattern.type];
      if (templates) {
        return templates[Math.floor(Math.random() * templates.length)];
      }
    }
  
    // Default encouraging message
    return "HULK WATCHING! MAKE STRONG MOVES!";
  };