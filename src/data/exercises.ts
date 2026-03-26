export type SetType = 'warmup' | 'feeler' | 'working';
export type RPEClass = 'low' | 'mid' | 'high' | 'max' | 'none';

export interface ExerciseSet {
  weight: string;
  reps: string;
  rest: string;
  rpe: string;
  rpeClass: RPEClass;
  type: SetType;
  notes: string;
}

export interface ProgressionRule {
  targetReps: number[];
  nextWeight: number;
  rawText: string;
}

export interface Exercise {
  num: number;
  name: string;
  supersetWith?: string;
  researchNote: string;
  sets: ExerciseSet[];
  formTips: string[];
  progression?: ProgressionRule;
  repRange?: [number, number];
}

export interface WorkoutDay {
  id: string;
  label: string;
  title: string;
  exercises: Exercise[];
}

export const workoutDays: WorkoutDay[] = [
  // ═══════════════════════════════════════════════════════════════════
  // UPPER A — Monday — Strength Focus (Chest + Back)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'upper-a',
    label: 'Monday',
    title: 'Upper A — Strength Focus (Chest + Back)',
    exercises: [
      // ── Exercise 1: Dumbbell Incline Bench Press ──
      {
        num: 1,
        name: 'Dumbbell Incline Bench Press',
        researchNote:
          'REP RANGE: 5\u20138 \u00b7 Compound press \u2014 SBS recommends 5\u201310 for pressing to maintain form quality. At 91 kg, going under 5 reps with DBs is unstable. 5\u20138 maximizes mechanical tension while keeping shoulders safe.',
        sets: [
          {
            weight: '12.5 kg',
            reps: '8',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Light groove',
          },
          {
            weight: '25 kg',
            reps: '5',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Ramp',
          },
          {
            weight: '42.5 kg',
            reps: '5\u20138',
            rest: '2.5 min',
            rpe: '7',
            rpeClass: 'low',
            type: 'working',
            notes: '~3 RIR. First set conservative \u2014 gauge your day.',
          },
          {
            weight: '42.5 kg',
            reps: '5\u20138',
            rest: '2.5 min',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes: '~2 RIR. Harder but not grinding reps.',
          },
          {
            weight: '42.5 kg',
            reps: '5\u20138',
            rest: '2.5 min',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: '1\u20132 RIR. Push this last set. Stop when form breaks.',
          },
        ],
        formTips: [
          'Set bench to 30\u201345\u00b0. Steeper angles shift work from upper pec to front delt. (Lauver et al. 2016, JSCR)',
          'Control the eccentric for 2\u20133 sec \u2014 don\u2019t just drop the dumbbells. Uncontrolled descents reduce upper pec tension and increase shoulder impingement risk. (Saeterbakken et al. 2017, JSCR)',
          'Lower to mid-chest level with a pronated grip at roughly shoulder width for maximum clavicular pec activation. (Trebs et al. 2010, JSCR)',
        ],
        progression: {
          targetReps: [8, 8, 8],
          nextWeight: 45,
          rawText: 'Progression: when you hit 8-8-8, go to 45 kg.',
        },
        repRange: [5, 8],
      },

      // ── Exercise 2: Bar Lateral Pulldown ──
      {
        num: 2,
        name: 'Bar Lateral Pulldown',
        researchNote:
          'REP RANGE: 6\u201310 \u00b7 SBS recommends 5\u201310 for pulldowns. Lower reps maintain form (no kipping). Higher than 10 = momentum and bicep dominance. 6\u201310 keeps lats as primary mover.',
        sets: [
          {
            weight: '35 kg',
            reps: '8',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Light groove',
          },
          {
            weight: '60 kg',
            reps: '5',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Intermediate ramp \u2014 bridge the gap to working weight.',
          },
          {
            weight: '90 kg',
            reps: '6\u201310',
            rest: '2 min',
            rpe: '7',
            rpeClass: 'low',
            type: 'working',
            notes: 'Clean reps, full stretch at top.',
          },
          {
            weight: '90 kg',
            reps: '6\u201310',
            rest: '2 min',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes: 'Should feel 2 reps left in the tank.',
          },
          {
            weight: '90 kg',
            reps: '6\u201310',
            rest: '2 min',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: 'Last set \u2014 push it. Full ROM, no half reps at top.',
          },
        ],
        formTips: [
          'Pull to upper chest, not behind the neck \u2014 behind-the-neck produces similar lat activation but massively increases shoulder injury risk. (Signorile et al. 2002, JSCR)',
          'Use a grip roughly 1.5\u00d7 shoulder width \u2014 wide grip produces greater lat activation than narrow. (Lusk et al. 2010, JSCR)',
          'Initiate by depressing and retracting your shoulder blades before bending the elbows \u2014 this loads lats over biceps. (Lehman et al. 2004, JSCR)',
        ],
        repRange: [6, 10],
      },

      // ── Exercise 3: Lever Seated Shoulder Press ──
      {
        num: 3,
        name: 'Lever Seated Shoulder Press',
        researchNote:
          'REP RANGE: 6\u201310 \u00b7 Compound press. RP recommends 5\u201310 for machine presses. Too heavy (<5) irritates AC joint. 6\u201310 balances strength stimulus with joint safety on overhead movement.',
        sets: [
          {
            weight: '25 kg',
            reps: '8',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Same warmup',
          },
          {
            weight: '55 kg',
            reps: '6\u201310',
            rest: '90s',
            rpe: '7\u20138',
            rpeClass: 'low',
            type: 'working',
            notes: 'Stay here and own the range.',
          },
          {
            weight: '55 kg',
            reps: '6\u201310',
            rest: '90s',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes: 'Controlled negative, no bouncing.',
          },
          {
            weight: '55 kg',
            reps: '6\u201310',
            rest: '90s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: 'When 10-10-10, go to 57.5 or 60 kg.',
          },
        ],
        formTips: [
          'Back firmly against the pad, press in the scapular plane (~30\u00b0 forward from the sides) to reduce shoulder impingement. (Saeterbakken & Fimland 2013, JSCR)',
          'Press in front of the head, never behind \u2014 anterior pressing produces similar delt activation with far less joint stress. (McKean & Burkett 2015, J Sports Sci Med)',
          'Avoid full lockout to keep constant tension on the deltoids and protect the elbows. (Schoenfeld & Contreras 2014, Strength Cond J)',
        ],
        progression: {
          targetReps: [10, 10, 10],
          nextWeight: 57.5,
          rawText: 'When 10-10-10, go to 57.5 or 60 kg.',
        },
        repRange: [6, 10],
      },

      // ── Exercise 4: Cable Straight Back Seated Row ──
      {
        num: 4,
        name: 'Cable Straight Back Seated Row',
        researchNote:
          'REP RANGE: 8\u201312 \u00b7 SBS recommends 8\u201315 for rows \u2014 too heavy turns rows into hip hinge. Cable row with strict form needs moderate load. 8\u201312 keeps back as limiter.',
        sets: [
          {
            weight: '35 kg',
            reps: '8',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Same warmup',
          },
          {
            weight: '60 kg',
            reps: '5',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Ramp \u2014 different movement pattern from pulldowns.',
          },
          {
            weight: '80 kg',
            reps: '8\u201312',
            rest: '90s',
            rpe: '7\u20138',
            rpeClass: 'low',
            type: 'working',
            notes: 'Chest up, pull to lower chest, 1s squeeze.',
          },
          {
            weight: '80 kg',
            reps: '8\u201312',
            rest: '90s',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes: 'RPE 8.',
          },
          {
            weight: '80 kg',
            reps: '8\u201312',
            rest: '90s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: 'When 12-12-12, go to 85 kg.',
          },
        ],
        formTips: [
          'Rigid upright torso \u2014 no rocking back. Trunk swaying kills mid-trap and rhomboid activation. (Lehman et al. 2004, JSCR)',
          'Squeeze shoulder blades together at peak contraction \u2014 significantly increases middle trap and rhomboid EMG. (Lehman et al. 2004, JSCR)',
          'Pull toward the navel, not the chest \u2014 this biases lower lats and mid-back over upper traps. (Signorile et al. 2002, JSCR)',
        ],
        progression: {
          targetReps: [12, 12, 12],
          nextWeight: 85,
          rawText: 'When 12-12-12, go to 85 kg.',
        },
        repRange: [8, 12],
      },

      // ── Exercise 5: Cable Leaning Lateral Raise ──
      {
        num: 5,
        name: 'Cable Leaning Lateral Raise',
        researchNote:
          'REP RANGE: 12\u201320 \u00b7 Side delts are small, high slow-twitch%. RP/SBS: isolation = 10\u201320+, side delts specifically 12\u201320. Heavy lateral raises recruit traps, not delts. Cable provides constant tension.',
        sets: [
          {
            weight: '15 kg',
            reps: '8',
            rest: '45s',
            rpe: '4\u20135',
            rpeClass: 'low',
            type: 'feeler',
            notes: 'Warm shoulder in this pattern',
          },
          {
            weight: '30 kg',
            reps: '12\u201320',
            rest: '60s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: 'Strict form, no momentum.',
          },
          {
            weight: '30 kg',
            reps: '12\u201320',
            rest: '60s',
            rpe: '9\u201310',
            rpeClass: 'max',
            type: 'working',
            notes: 'Last set \u2014 go to failure. Safe on isolations.',
          },
        ],
        formTips: [
          'Lean away from the cable ~15\u201320\u00b0 to keep tension on the side delt through the entire range \u2014 especially the bottom where a standing raise has zero load. (Contreras & Schoenfeld 2011, Strength Cond J)',
          'Raise to ~90\u00b0 (arm parallel to floor), no higher \u2014 past that point the upper trap takes over from the side delt. (Reinold et al. 2009, J Athletic Training)',
          'Lead with the elbow slightly above the wrist (slight internal rotation) to maximize medial delt recruitment. (Oliveira et al. 2009, J Electromyogr Kinesiol)',
        ],
        progression: undefined,
        repRange: [12, 20],
      },

      // ── Exercise 6: Omni Direction Face Pull (with Rope) ──
      {
        num: 6,
        name: 'Omni Direction Face Pull (with Rope)',
        researchNote:
          'REP RANGE: 15\u201325 \u00b7 Rear delts = small, high slow-twitch%. Very safe joint-wise. RP recommends 15\u201325 for rear delts. Higher reps = more metabolic stress which rear delts respond to.',
        sets: [
          {
            weight: '25 kg',
            reps: '8',
            rest: '45s',
            rpe: '4\u20135',
            rpeClass: 'low',
            type: 'feeler',
            notes: 'Feel rear delts + external rotators',
          },
          {
            weight: '40 kg',
            reps: '15\u201325',
            rest: '60s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: '40 kg targets rear delts properly at this rep range.',
          },
          {
            weight: '40 kg',
            reps: '15\u201325',
            rest: '60s',
            rpe: '9\u201310',
            rpeClass: 'max',
            type: 'working',
            notes:
              'Go to failure. Pull to forehead, elbows high, external rotate.',
          },
        ],
        formTips: [
          'Externally rotate your shoulders as you pull the rope apart at face height \u2014 this maximizes infraspinatus and posterior delt activation. (Reinold et al. 2009, J Athletic Training)',
          'Pull toward the forehead, not the chin \u2014 higher pull line increases rear delt and rotator cuff EMG. (Schoenfeld et al. 2013, JSCR)',
          'Keep elbows at or slightly above shoulder height throughout. (Escamilla et al. 2009, Med Sci Sports Exerc)',
        ],
        repRange: [15, 25],
      },

      // ── Exercise 7: Triceps Pushdown ──
      {
        num: 7,
        name: 'Triceps Pushdown',
        supersetWith: 'SS #8',
        researchNote:
          'REP RANGE: 10\u201315 \u00b7 Single-joint, elbow-only movement. RP: 10\u201315 for pushdowns. Going heavy (<8) stresses elbows. Triceps get heavy work from all pressing \u2014 this is volume/pump work.',
        sets: [
          {
            weight: '40 kg',
            reps: '8',
            rest: '45s',
            rpe: '4\u20135',
            rpeClass: 'low',
            type: 'feeler',
            notes: 'Warm elbows',
          },
          {
            weight: '70 kg',
            reps: '10\u201315',
            rest: '0s \u2192 curl',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: 'Go straight to curls.',
          },
          {
            weight: '70 kg',
            reps: '10\u201315',
            rest: '0s \u2192 curl',
            rpe: '9\u201310',
            rpeClass: 'max',
            type: 'working',
            notes: 'Last set to failure. Then curls.',
          },
        ],
        formTips: [
          'Pin elbows to your sides \u2014 elbow drift forward turns this into a lat movement and kills triceps long head load. (Boeckh-Behrens & Buskies 2000, cited in Schoenfeld 2010)',
          'Lean the torso forward 10\u201315\u00b0 to keep the cable aligned with your forearm through the full range. (Oliveira et al. 2009, J Electromyogr Kinesiol)',
          'Fully extend at the bottom and hold briefly \u2014 peak lateral head activation occurs in the final 30\u00b0 of extension. (Signorile et al. 2006, JSCR)',
        ],
        repRange: [10, 15],
      },

      // ── Exercise 8: Dumbbell Incline Curl ──
      {
        num: 8,
        name: 'Dumbbell Incline Curl',
        supersetWith: 'SS #7',
        researchNote:
          'REP RANGE: 8\u201312 \u00b7 Incline curl = stretched position for bicep, safe on joints. SBS: 8+ for curls. Not too high (>15) because grip fails before bicep. 8\u201312 sweet spot.',
        sets: [
          {
            weight: '15 kg',
            reps: '8\u201312',
            rest: '90s \u2192 #7',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: '15 kg for solid 8\u201312 both sets.',
          },
          {
            weight: '15 kg',
            reps: '8\u201312',
            rest: '90s \u2192 #7',
            rpe: '9\u201310',
            rpeClass: 'max',
            type: 'working',
            notes:
              'Last set close to failure. 90s rest then back to pushdown.',
          },
        ],
        formTips: [
          'Set bench at 45\u201360\u00b0 incline \u2014 this places the biceps long head on a greater stretch, producing higher EMG than upright curls. (Oliveira et al. 2009, J Electromyogr Kinesiol)',
          'Let arms hang fully extended before curling \u2014 full shoulder extension is the key advantage of incline curls for the long head. (Schoenfeld et al. 2023, JSCR)',
          'Keep upper arms perpendicular to the floor throughout \u2014 no swinging or shoulder flexion. (Trebs et al. 2010, JSCR)',
        ],
        progression: {
          targetReps: [12, 12],
          nextWeight: 17.5,
          rawText: 'When 12-12, go to 17.5.',
        },
        repRange: [8, 12],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // LOWER A — Tuesday — Strength Focus (Quad Emphasis)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'lower-a',
    label: 'Tuesday',
    title: 'Lower A — Strength Focus (Quad Emphasis)',
    exercises: [
      // ── Exercise 1: Barbell Full Squat ──
      {
        num: 1,
        name: 'Barbell Full Squat',
        researchNote:
          'REP RANGE: 4\u20136 \u00b7 Heavy compound, high technical demand. SBS: 5\u201310 for squats. In a deficit, 4\u20136 maximizes strength retention signal with minimal fatigue accumulation. Helms 2016: compounds at RPE 6\u20138.',
        sets: [
          {
            weight: 'Bar (20 kg)',
            reps: '8',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Groove',
          },
          {
            weight: '60 kg',
            reps: '5',
            rest: '90s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Ramp',
          },
          {
            weight: '100 kg',
            reps: '3',
            rest: '90s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Ramp',
          },
          {
            weight: '145 kg',
            reps: '4\u20136',
            rest: '3 min',
            rpe: '7',
            rpeClass: 'low',
            type: 'working',
            notes: '3 RIR. First set feel the load, don\u2019t grind.',
          },
          {
            weight: '145 kg',
            reps: '4\u20136',
            rest: '3 min',
            rpe: '7\u20138',
            rpeClass: 'low',
            type: 'working',
            notes: '2\u20133 RIR.',
          },
          {
            weight: '145 kg',
            reps: '4\u20136',
            rest: '3 min',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes:
              '2 RIR. NEVER go to failure on heavy squats in a deficit.',
          },
        ],
        formTips: [
          'Go to full depth (thighs past parallel) \u2014 deep squats produce significantly greater glute activation than parallel or partial squats. (Caterisano et al. 2002, JSCR)',
          'Keep your trunk as upright as possible and drive knees in line with toes \u2014 excessive forward lean shifts load to the lumbar spine. (Escamilla 2001, Med Sci Sports Exerc)',
          'Control the tempo \u2014 don\u2019t dive-bomb. Controlled descents reduce patellofemoral compressive forces under heavy load. (Schoenfeld 2010, JSCR)',
        ],
        repRange: [4, 6],
      },

      // ── Exercise 2: Lever Seated Leg Curl ──
      {
        num: 2,
        name: 'Lever Seated Leg Curl',
        researchNote:
          'REP RANGE: 8\u201312 \u00b7 Seated curl = hip flexed position = longer hamstring muscle length. Maeo 2021: seated/hip-flexed curl > prone for hamstring growth. Placed at position 2 because squats don\u2019t meaningfully fatigue hamstrings \u2014 they arrive at the curl fresh. Lower B covers shortened position with lying curl + RDL for stretched position.',
        sets: [
          {
            weight: '30 kg',
            reps: '8',
            rest: '45s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Warm hamstrings',
          },
          {
            weight: '45 kg',
            reps: '8\u201312',
            rest: '60s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: '45 kg at 8\u201312 = proper working zone.',
          },
          {
            weight: '45 kg',
            reps: '8\u201312',
            rest: '60s',
            rpe: '9',
            rpeClass: 'high',
            type: 'working',
            notes: '1 RIR. Controlled reps. When 12-12-12, go to 50.',
          },
          {
            weight: '45 kg',
            reps: '8\u201312',
            rest: '60s',
            rpe: '9\u201310',
            rpeClass: 'max',
            type: 'working',
            notes: 'Last set to failure \u2014 safe on machine.',
          },
        ],
        formTips: [
          'Dorsiflex your ankle (pull toes toward shin) during the curl \u2014 this reduces gastrocnemius contribution and better isolates the hamstrings. (Schoenfeld et al. 2015, JSCR)',
          'The seated position is key \u2014 hip-flexed = hamstrings at a longer length = higher biceps femoris long head activation vs lying curl. (Schoenfeld et al. 2015)',
          'Control the eccentric \u2014 don\u2019t let the pad snap back. Rapid eccentric overload in a shortened hamstring position increases strain injury risk. (Bourne et al. 2017, BJSM)',
        ],
        progression: {
          targetReps: [12, 12, 12],
          nextWeight: 50,
          rawText:
            'When 12-12-12, go to 50.',
        },
        repRange: [8, 12],
      },

      // ── Exercise 3: Sled Wide Hack Squat ──
      {
        num: 3,
        name: 'Sled Wide Hack Squat',
        researchNote:
          'REP RANGE: 8\u201312 \u00b7 Machine compound, zero spinal load. Can push harder safely. 8\u201312 for hypertrophy stimulus without CNS drain after heavy squats.',
        sets: [
          {
            weight: '80 kg',
            reps: '6',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Ramp',
          },
          {
            weight: '120 kg',
            reps: '3',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Ramp \u2014 knees load differently than barbell squat.',
          },
          {
            weight: '160 kg',
            reps: '8\u201312',
            rest: '2 min',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes: 'After heavy squats, expect ~8\u201310 reps.',
          },
          {
            weight: '160 kg',
            reps: '8\u201312',
            rest: '2 min',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: 'RPE 8\u20139.',
          },
          {
            weight: '160 kg',
            reps: '8\u201312',
            rest: '2 min',
            rpe: '9',
            rpeClass: 'high',
            type: 'working',
            notes:
              'Last set push hard. Machine = safe to go closer to failure.',
          },
        ],
        formTips: [
          'Wide, externally rotated foot placement to increase adductor and VMO (inner quad) recruitment. (Escamilla et al. 2001, Med Sci Sports Exerc)',
          'Descend to at least 90\u00b0 knee flexion \u2014 greater ROM increases overall quad activation. (Bloomquist et al. 2013, Eur J Appl Physiol)',
          'Keep your back flat against the pad \u2014 don\u2019t let hips lift off, which transfers load to the lumbar spine. (Escamilla et al. 2001)',
        ],
        repRange: [8, 12],
      },

      // ── Exercise 4: Lever Leg Extension ──
      {
        num: 4,
        name: 'Lever Leg Extension',
        researchNote:
          'REP RANGE: 10\u201315 \u00b7 Single-joint, very safe. Quads respond well to moderate-high reps. Tension curve is ascending (hardest at top) = great for squeeze/hold. Research supports 10\u201315 for extensions.',
        sets: [
          {
            weight: '40 kg',
            reps: '8',
            rest: '45s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Warm quads',
          },
          {
            weight: '65 kg',
            reps: '5',
            rest: '45s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Ramp \u2014 patellar tendon loads uniquely on extensions.',
          },
          {
            weight: '90 kg',
            reps: '10\u201315',
            rest: '60s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes:
              '90 kg at 10\u201315 with proper RPE. Squeeze 1s at top.',
          },
          {
            weight: '90 kg',
            reps: '10\u201315',
            rest: '60s',
            rpe: '9\u201310',
            rpeClass: 'max',
            type: 'working',
            notes:
              'Last set to failure \u2014 safe on leg extensions. When 15-15, go to 95.',
          },
        ],
        formTips: [
          'Lock out fully at the top \u2014 rectus femoris and VMO EMG peaks in the final 30\u00b0 of extension. That\u2019s where the money is. (Signorile et al. 1994, JSCR)',
          'Control the eccentric (2\u20133 sec down) \u2014 dropping the weight reduces quad tension and increases patellar tendon shear. (Escamilla et al. 1998, Med Sci Sports Exerc)',
          'Keep feet neutral or slightly externally rotated \u2014 internal rotation causes abnormal patellofemoral tracking. (Escamilla 2001)',
        ],
        progression: {
          targetReps: [15, 15],
          nextWeight: 95,
          rawText: 'When 15-15, go to 95.',
        },
        repRange: [10, 15],
      },

      // ── Exercise 5: Smith Hip Thrust ──
      {
        num: 5,
        name: 'Smith Hip Thrust',
        researchNote:
          'REP RANGE: 10\u201315 \u00b7 Glute isolation. Full lockout = peak contraction. Smith machine = stable bar path, safe for progressive overload. Both lower days include direct glute work for frequency.',
        sets: [
          {
            weight: '60 kg',
            reps: '8',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Feel glutes, full lockout',
          },
          {
            weight: '100 kg',
            reps: '10\u201315',
            rest: '90s',
            rpe: '7\u20138',
            rpeClass: 'low',
            type: 'working',
            notes: 'Find your groove.',
          },
          {
            weight: '100 kg',
            reps: '10\u201315',
            rest: '90s',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes:
              'Full hip extension, 1s squeeze at top. Drive through heels.',
          },
          {
            weight: '100 kg',
            reps: '10\u201315',
            rest: '90s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: 'When 15-15-15, go to 110.',
          },
        ],
        formTips: [
          'Drive through heels and achieve full hip extension \u2014 peak glute EMG occurs at top-range lockout with a hard squeeze. (Contreras et al. 2011, J Appl Biomech)',
          'Posterior pelvic tilt at the top \u2014 tuck your pelvis under to maximize glute activation and prevent lumbar hyperextension. (Contreras et al. 2015, JSCR)',
          'Position feet so shins are roughly vertical at the top \u2014 too far forward biases hamstrings, too close biases quads. (Contreras et al. 2011)',
        ],
        progression: {
          targetReps: [15, 15, 15],
          nextWeight: 110,
          rawText: 'When 15-15-15, go to 110.',
        },
        repRange: [10, 15],
      },

      // ── Exercise 6: Lever Standing Calf Raise ──
      {
        num: 6,
        name: 'Lever Standing Calf Raise',
        researchNote:
          'REP RANGE: 8\u201315 \u00b7 Standing calf raise = 5\u201312% more growth than seated for gastrocnemius. Full ROM critical \u2014 2s pause at bottom stretch, squeeze at top. 8\u201315 because gastrocnemius is mixed fiber.',
        sets: [
          {
            weight: '40 kg',
            reps: '8',
            rest: '45s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Full stretch at bottom',
          },
          {
            weight: '75 kg',
            reps: '5',
            rest: '45s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Ramp \u2014 protect achilles through the load jump.',
          },
          {
            weight: '110 kg',
            reps: '8\u201315',
            rest: '60s',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes:
              'Full ROM = pause at bottom stretch, squeeze at top.',
          },
          {
            weight: '110 kg',
            reps: '8\u201315',
            rest: '60s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: 'PLATEAU TIP: Try "1.5 reps" technique.',
          },
          {
            weight: '110 kg',
            reps: '8\u201315',
            rest: '60s',
            rpe: '9',
            rpeClass: 'high',
            type: 'working',
            notes: 'When 15-15-15, go to 115. Never bounce.',
          },
        ],
        formTips: [
          'Full stretch at the bottom (heels below the platform) and squeeze at the top \u2014 gastrocnemius produces its highest EMG through this full ROM when the knee is straight. (Riemann et al. 2011, JSCR)',
          'Keep knees locked \u2014 any knee bend shifts work from gastrocnemius to soleus. (Signorile et al. 2002, JSCR)',
          '2-second pause at full dorsiflexion (bottom stretch) to maximize the stretch and reduce Achilles tendon ballistic loading. (Riemann et al. 2011)',
        ],
        progression: {
          targetReps: [15, 15, 15],
          nextWeight: 115,
          rawText: 'When 15-15-15, go to 115. Never bounce.',
        },
        repRange: [8, 15],
      },

      // ── Exercise 7: Captain's Chair Straight Leg Raise ──
      {
        num: 7,
        name: "Captain's Chair Straight Leg Raise",
        researchNote:
          'REP RANGE: 10\u201320 \u00b7 Abs = high slow-twitch%, respond to volume and time under tension. Control tempo to adjust difficulty. RP recommends 10\u201320 for direct ab work. Use captain\u2019s chair \u2014 at 91 kg grip fails before abs on bar hang.',
        sets: [
          {
            weight: 'BW',
            reps: '10\u201320',
            rest: '60s',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes:
              'SLOW: 3s up, 2s hold, 3s down. No swinging.',
          },
          {
            weight: 'BW',
            reps: '10\u201320',
            rest: '60s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes:
              'If >20 reps with slow tempo, hold DB between feet.',
          },
          {
            weight: 'BW',
            reps: '10\u201320',
            rest: '60s',
            rpe: '9',
            rpeClass: 'high',
            type: 'working',
            notes: 'Focus on posterior pelvic tilt at top.',
          },
        ],
        formTips: [
          'Initiate with a posterior pelvic tilt before lifting \u2014 this engages abs rather than just hip flexors doing the work. (Konrad et al. 2001, Physical Therapy)',
          'Legs straight, raise to at least horizontal \u2014 this variation produced the highest rectus abdominis EMG among common ab exercises. (Boeckh-Behrens & Buskies 2000, cited in ACE research)',
          'No swinging \u2014 controlled reps showed significantly higher ab activation than ballistic reps. (Escamilla et al. 2006, J Orthop Sports Phys Ther)',
        ],
        repRange: [10, 20],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // UPPER B — Thursday — Hypertrophy Focus (Shoulders + Back)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'upper-b',
    label: 'Thursday',
    title: 'Upper B — Hypertrophy Focus (Shoulders + Back)',
    exercises: [
      // ── Exercise 1: Lever Seated Shoulder Press ──
      {
        num: 1,
        name: 'Lever Seated Shoulder Press',
        researchNote:
          'REP RANGE: 6\u20138 \u00b7 Heavy anchor for shoulders. This is your shoulder strength day. 6\u20138 gives strength signal. Machine = safe for lower reps than free-weight OH press.',
        sets: [
          {
            weight: '25 kg',
            reps: '8',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Same warmup',
          },
          {
            weight: '45 kg',
            reps: '5',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Ramp \u2014 shoulders cold, this is exercise 1.',
          },
          {
            weight: '60 kg',
            reps: '6\u20138',
            rest: '2.5 min',
            rpe: '7\u20138',
            rpeClass: 'low',
            type: 'working',
            notes: 'If 60 feels impossible, fall back to 55.',
          },
          {
            weight: '60 kg',
            reps: '6\u20138',
            rest: '2.5 min',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes: 'RPE 8 = 2 RIR.',
          },
          {
            weight: '60 kg',
            reps: '6\u20138',
            rest: '2.5 min',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: 'When 8-8-8, go to 62.5 or 65 kg.',
          },
        ],
        formTips: [
          'Back firmly against the pad, press in the scapular plane (~30\u00b0 forward) to reduce shoulder impingement. (Saeterbakken & Fimland 2013, JSCR)',
          'Press in front, never behind the head \u2014 similar delt activation with far less joint stress. (McKean & Burkett 2015, J Sports Sci Med)',
          'Avoid full lockout to keep constant tension on delts and protect elbows. (Schoenfeld & Contreras 2014, Strength Cond J)',
        ],
        progression: {
          targetReps: [8, 8, 8],
          nextWeight: 62.5,
          rawText: 'When 8-8-8, go to 62.5 or 65 kg.',
        },
        repRange: [6, 8],
      },

      // ── Exercise 2: Lever Lying T-bar Row ──
      {
        num: 2,
        name: 'Lever Lying T-bar Row',
        researchNote:
          'REP RANGE: 8\u201312 \u00b7 Chest-supported row = different angle than cable row. Removes momentum/cheating. Chest support means you can focus purely on back contraction.',
        sets: [
          {
            weight: '20 kg',
            reps: '8',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Light, feel the back',
          },
          {
            weight: '50 kg',
            reps: '8\u201312',
            rest: '90s',
            rpe: '7\u20138',
            rpeClass: 'low',
            type: 'working',
            notes: 'Start 50, progress fast.',
          },
          {
            weight: '50 kg',
            reps: '8\u201312',
            rest: '90s',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes:
              'Squeeze scapulae at top, full stretch at bottom.',
          },
          {
            weight: '50 kg',
            reps: '8\u201312',
            rest: '90s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: 'When 12-12-12, go to 55 kg.',
          },
        ],
        formTips: [
          'Keep chest firmly pressed into the pad \u2014 chest support eliminates momentum cheating and isolates lat/rhomboid activation. (Saeterbakken et al. 2015, JSCR)',
          'Pronated (overhand) grip biases posterior delt and mid-traps; neutral/supinated shifts more load to biceps. (Lehman et al. 2004, JSCR)',
          'Full scapular retraction at peak contraction and controlled eccentric \u2014 this produces significantly more mid-trap activation than partial ROM. (Schoenfeld et al. 2022, JSCR)',
        ],
        progression: {
          targetReps: [12, 12, 12],
          nextWeight: 55,
          rawText: 'When 12-12-12, go to 55 kg.',
        },
        repRange: [8, 12],
      },

      // ── Exercise 3: Lever Lying Chest Press ──
      {
        num: 3,
        name: 'Lever Lying Chest Press',
        researchNote:
          'REP RANGE: 8\u201312 \u00b7 Machine press, hypertrophy day. This is day 2 for chest \u2014 higher reps for metabolic stress and volume accumulation.',
        sets: [
          {
            weight: '40 kg',
            reps: '7',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Warmup',
          },
          {
            weight: '80 kg',
            reps: '8\u201312',
            rest: '90s',
            rpe: '7\u20138',
            rpeClass: 'low',
            type: 'working',
            notes: '80 kg at RPE 8.',
          },
          {
            weight: '80 kg',
            reps: '8\u201312',
            rest: '90s',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes: 'Controlled tempo, stretch at bottom.',
          },
          {
            weight: '80 kg',
            reps: '8\u201312',
            rest: '90s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: 'When 12-12-12, go to 85 kg.',
          },
        ],
        formTips: [
          'Keep shoulder blades retracted and depressed against the pad \u2014 this maximizes pec activation and reduces anterior delt substitution. (Saeterbakken et al. 2011, JSCR)',
          'Align handles with mid-nipple line \u2014 too high shifts work to front delts and increases shoulder stress. (Lauver et al. 2016, JSCR)',
          'Full ROM \u2014 partial reps significantly reduce pec EMG amplitude. (Schoenfeld & Grgic 2020, SAGE Open Med)',
        ],
        progression: {
          targetReps: [12, 12, 12],
          nextWeight: 85,
          rawText: 'When 12-12-12, go to 85 kg.',
        },
        repRange: [8, 12],
      },

      // ── Exercise 4: Cable Rear Delt Fly ──
      {
        num: 4,
        name: 'Cable Rear Delt Fly',
        researchNote:
          'REP RANGE: 15\u201325 \u00b7 Rear delts are small, slow-twitch dominant. Heavy rear delt work just recruits traps. High reps + strict form = rear delt growth.',
        sets: [
          {
            weight: '20 kg',
            reps: '8',
            rest: '45s',
            rpe: '4\u20135',
            rpeClass: 'low',
            type: 'feeler',
            notes: 'Rear delt activation',
          },
          {
            weight: '35 kg',
            reps: '15\u201325',
            rest: '60s',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes:
              'Set 1 is a genuine working set. 35 kg lets you push to 20+.',
          },
          {
            weight: '35 kg',
            reps: '15\u201325',
            rest: '60s',
            rpe: '9',
            rpeClass: 'high',
            type: 'working',
            notes:
              'Controlled reps, strict form. No trap recruitment.',
          },
          {
            weight: '35 kg',
            reps: '15\u201325',
            rest: '60s',
            rpe: '9\u201310',
            rpeClass: 'max',
            type: 'working',
            notes:
              'Last set push close to failure. Safe on rear delt isolation.',
          },
        ],
        formTips: [
          'Cable at upper-chest to face height, pull with arms nearly straight \u2014 this maximizes posterior delt EMG over a bent-arm row pattern. (Schoenfeld et al. 2013, JSCR)',
          'Keep shoulders externally rotated (thumbs pointing up/back) to increase infraspinatus activation and reduce impingement. (Reinold et al. 2009, J Athletic Training)',
          'Light-to-moderate load with a 2-sec eccentric \u2014 heavy loads cause trap substitution. Rear delts respond to time under tension. (Escamilla et al. 2009, Med Sci Sports Exerc)',
        ],
        repRange: [15, 25],
      },

      // ── Exercise 5: Cable Standing Fly ──
      {
        num: 5,
        name: 'Cable Standing Fly',
        researchNote:
          'REP RANGE: 10\u201315 \u00b7 Chest isolation. Cables = constant tension. 10\u201315 for flys \u2014 too heavy and you turn it into a pressing motion. Focus on stretch + squeeze.',
        sets: [
          {
            weight: '30 kg',
            reps: '8',
            rest: '45s',
            rpe: '4\u20135',
            rpeClass: 'low',
            type: 'feeler',
            notes: 'Feel pec stretch',
          },
          {
            weight: '50 kg',
            reps: '10\u201315',
            rest: '60s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: 'Focus on pec squeeze.',
          },
          {
            weight: '50 kg',
            reps: '10\u201315',
            rest: '60s',
            rpe: '9\u201310',
            rpeClass: 'max',
            type: 'working',
            notes:
              'Last set close to failure. Squeeze at peak, stretch at bottom.',
          },
        ],
        formTips: [
          'Set pulleys at shoulder height for mid-pec activation. High-to-low targets lower pec, low-to-high targets upper pec. (Lauver et al. 2016, JSCR)',
          'Cross hands slightly past midline at peak contraction \u2014 pec EMG continues to increase past the midline. (Trebs et al. 2010, JSCR)',
          'Maintain a slight fixed elbow bend (~15\u201320\u00b0) throughout \u2014 straightening overstresses biceps tendon, bending too much turns it into a press. (Saeterbakken et al. 2011, JSCR)',
        ],
        repRange: [10, 15],
      },

      // ── Exercise 6: Cable Leaning Lateral Raise ──
      {
        num: 6,
        name: 'Cable Leaning Lateral Raise',
        researchNote:
          'REP RANGE: 12\u201320 \u00b7 Side delts trained on both upper days for frequency. Cable = constant tension, high reps keep traps out. Lighter than Upper A \u2014 fatigue is higher this late in session.',
        sets: [
          {
            weight: '10 kg',
            reps: '8',
            rest: '45s',
            rpe: '4\u20135',
            rpeClass: 'low',
            type: 'feeler',
            notes: 'Warm shoulder in this pattern',
          },
          {
            weight: '25 kg',
            reps: '12\u201320',
            rest: '60s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes:
              'Start lighter than Upper A (25 vs 30) \u2014 late in session.',
          },
          {
            weight: '25 kg',
            reps: '12\u201320',
            rest: '60s',
            rpe: '9\u201310',
            rpeClass: 'max',
            type: 'working',
            notes:
              'Last set to failure. When 20-20, go to 27.5 or 30.',
          },
        ],
        formTips: [
          'Lean away ~15\u201320\u00b0 to maintain tension through full range, especially at the bottom. (Contreras & Schoenfeld 2011, Strength Cond J)',
          'Raise to ~90\u00b0 only \u2014 past that, upper traps dominate over side delts. (Reinold et al. 2009, J Athletic Training)',
          'Lead with elbow slightly above wrist for max medial delt recruitment. (Oliveira et al. 2009, J Electromyogr Kinesiol)',
        ],
        progression: {
          targetReps: [20, 20],
          nextWeight: 27.5,
          rawText: 'When 20-20, go to 27.5 or 30.',
        },
        repRange: [12, 20],
      },

      // ── Exercise 7: Overhead Triceps Extension ──
      {
        num: 7,
        name: 'Overhead Triceps Extension',
        supersetWith: 'SS #8',
        researchNote:
          'REP RANGE: 10\u201315 \u00b7 OH position = tricep long head at stretched length (Maeo 2023: OH extension > pushdown for long head growth). 10\u201315 because going heavy irritates elbows.',
        sets: [
          {
            weight: '30 kg',
            reps: '8',
            rest: '45s',
            rpe: '4\u20135',
            rpeClass: 'low',
            type: 'feeler',
            notes:
              'Critical for elbows. Never go cold into OH extensions.',
          },
          {
            weight: '60 kg',
            reps: '10\u201315',
            rest: '0s \u2192 curl',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: '60 kg at 10\u201315 with proper RPE.',
          },
          {
            weight: '60 kg',
            reps: '10\u201315',
            rest: '0s \u2192 curl',
            rpe: '9\u201310',
            rpeClass: 'max',
            type: 'working',
            notes: 'Last set push hard. Then curls.',
          },
        ],
        formTips: [
          'The overhead position is the whole point \u2014 it places the long head on maximum stretch, producing significantly higher long-head EMG than pushdowns. (Signorile et al. 2006, JSCR)',
          'Keep upper arms close to ears and stationary \u2014 flaring elbows reduces long head stretch and recruits lats. (Boeckh-Behrens & Buskies 2000, cited in Schoenfeld 2010)',
          'Full elbow extension on each rep \u2014 the long head contributes most in the last 60\u00b0 of extension. (Oliveira et al. 2009, J Electromyogr Kinesiol)',
        ],
        repRange: [10, 15],
      },

      // ── Exercise 8: EZ Bar Curl or Hammer Curl ──
      {
        num: 8,
        name: 'EZ Bar Curl or Hammer Curl',
        supersetWith: 'SS #7',
        researchNote:
          'REP RANGE: 8\u201312 \u00b7 Different curl variation from Upper A (incline = stretched, EZ/hammer = neutral/shortened). Variety prevents repetitive strain.',
        sets: [
          {
            weight: '25 kg',
            reps: '8\u201312',
            rest: '90s \u2192 #7',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: 'EZ curl ~25 kg. Hammer ~15 kg/hand.',
          },
          {
            weight: '25 kg',
            reps: '8\u201312',
            rest: '90s \u2192 #7',
            rpe: '9\u201310',
            rpeClass: 'max',
            type: 'working',
            notes:
              'Last set close to failure. 90s rest then back to OH extension.',
          },
        ],
        formTips: [
          'EZ curl: Use the inner (angled) grip to reduce wrist strain while maintaining similar biceps short-head activation to a straight bar. (Marcolin et al. 2018, PeerJ)',
          'Hammer curl: Neutral grip shifts activation to brachioradialis and brachialis \u2014 use as a complement to supinated curls, not a replacement. (Oliveira et al. 2009, J Electromyogr Kinesiol)',
          'Eliminate trunk sway \u2014 stand against a wall or brace your back. Body english reduces biceps activation by up to 20%. (Schoenfeld et al. 2023, JSCR)',
        ],
        repRange: [8, 12],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // LOWER B — Friday — Hypertrophy Focus (Posterior Chain)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'lower-b',
    label: 'Friday',
    title: 'Lower B — Hypertrophy Focus (Posterior Chain)',
    exercises: [
      // ── Exercise 1: Sled 45° Leg Press ──
      {
        num: 1,
        name: 'Sled 45\u00b0 Leg Press',
        researchNote:
          'REP RANGE: 8\u201312 \u00b7 Machine compound, no spinal load. Allows heavy quad work safely. Going too light (15+) = cardiovascular failure before quad failure.',
        sets: [
          {
            weight: '120 kg',
            reps: '8',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Same warmup',
          },
          {
            weight: '200 kg',
            reps: '5',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Ramp \u2014 bridge the 155 kg gap to working weight.',
          },
          {
            weight: '275 kg',
            reps: '8\u201312',
            rest: '2.5 min',
            rpe: '7\u20138',
            rpeClass: 'low',
            type: 'working',
            notes: 'Full depth, knees track toes.',
          },
          {
            weight: '275 kg',
            reps: '8\u201312',
            rest: '2.5 min',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes: 'RPE 8.',
          },
          {
            weight: '275 kg',
            reps: '8\u201312',
            rest: '2.5 min',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes:
              'When 12-12-12, go to 285. Never lock knees at top.',
          },
        ],
        formTips: [
          'Feet high on the platform to increase hip extension demand \u2014 significantly increases glute and hamstring activation. (Escamilla et al. 2001, Med Sci Sports Exerc)',
          'Wide stance with toes slightly turned out to increase adductor and VMO recruitment. (Escamilla et al. 2001)',
          'Lower until knees hit at least 90\u00b0 but don\u2019t let lumbar spine round off the pad (butt wink) \u2014 that puts shear force on the lower back. (Schoenfeld 2010)',
        ],
        progression: {
          targetReps: [12, 12, 12],
          nextWeight: 285,
          rawText:
            'When 12-12-12, go to 285. Never lock knees at top.',
        },
        repRange: [8, 12],
      },

      // ── Exercise 2: Romanian Deadlift ──
      {
        num: 2,
        name: 'Romanian Deadlift',
        researchNote:
          'REP RANGE: 6\u20138 \u00b7 Heavy hip hinge, high spinal load. Placed after leg press because spine is FRESH (zero spinal load). 6\u20138 maximizes hamstring tension at stretched position.',
        sets: [
          {
            weight: '60 kg',
            reps: '6',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Hinge pattern, feel hamstring stretch',
          },
          {
            weight: '120 kg',
            reps: '6\u20138',
            rest: '2.5 min',
            rpe: '7',
            rpeClass: 'low',
            type: 'working',
            notes: 'Spine fresh from leg press.',
          },
          {
            weight: '120 kg',
            reps: '6\u20138',
            rest: '2.5 min',
            rpe: '7\u20138',
            rpeClass: 'low',
            type: 'working',
            notes:
              'Stretch hamstrings at bottom, squeeze glutes at top.',
          },
          {
            weight: '120 kg',
            reps: '6\u20138',
            rest: '2.5 min',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes:
              '2 RIR. NEVER grind RDLs. When 8-8-8, go to 125.',
          },
        ],
        formTips: [
          'Neutral spine with slight lumbar lordosis throughout \u2014 spinal flexion under load dramatically increases disc shear forces. (McGill 2007, Low Back Disorders)',
          'Hinge at the hips and push them back, bar nearly touching your thighs \u2014 maximizes hamstring and glute stretch/activation. (McAllister et al. 2014, JSCR)',
          'Lower to mid-shin or until you feel a strong hamstring stretch without rounding \u2014 going further yields no extra hamstring EMG but increases lumbar risk. (Schoenfeld et al. 2015)',
        ],
        progression: {
          targetReps: [8, 8, 8],
          nextWeight: 125,
          rawText: 'When 8-8-8, go to 125.',
        },
        repRange: [6, 8],
      },

      // ── Exercise 3: Lever Lying Leg Curl ──
      {
        num: 3,
        name: 'Lever Lying Leg Curl',
        researchNote:
          'REP RANGE: 8\u201312 \u00b7 Prone/lying curl = hip extended = shorter hamstring length. Provides variety alongside seated curl on Lower A. RDL above covers stretched position.',
        sets: [
          {
            weight: '30 kg',
            reps: '8',
            rest: '45s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Warm hamstrings',
          },
          {
            weight: '60 kg',
            reps: '8\u201312',
            rest: '60s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: 'Fast concentric, 3s eccentric.',
          },
          {
            weight: '60 kg',
            reps: '8\u201312',
            rest: '60s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: 'When 12-12-12, go to 65.',
          },
          {
            weight: '60 kg',
            reps: '8\u201312',
            rest: '60s',
            rpe: '9\u201310',
            rpeClass: 'max',
            type: 'working',
            notes:
              'Last set to failure. 3-sec eccentrics + pause at stretched position.',
          },
        ],
        formTips: [
          'Brace core and keep hips pressed into the pad \u2014 arching allows anterior pelvic tilt, shortening the hamstrings and reducing activation. (Schoenfeld et al. 2015)',
          'Dorsiflex to isolate hamstrings, or plantarflex slightly to recruit gastrocnemius as a synergist. (Bourne et al. 2017, BJSM)',
          'Emphasize slow eccentrics \u2014 eccentric-focused curls preferentially activate the biceps femoris long head, which protects against hamstring strains. (Bourne et al. 2017; Mjolsnes et al. 2004, BJSM)',
        ],
        progression: {
          targetReps: [12, 12, 12],
          nextWeight: 65,
          rawText: 'When 12-12-12, go to 65.',
        },
        repRange: [8, 12],
      },

      // ── Exercise 4: Smith Hip Thrust ──
      {
        num: 4,
        name: 'Smith Hip Thrust',
        researchNote:
          'REP RANGE: 10\u201315 \u00b7 Glute isolation. Glutes are large, mixed-fiber. Full lockout at top = peak contraction. Going too heavy = lumbar hyperextension.',
        sets: [
          {
            weight: '80 kg',
            reps: '8',
            rest: '60s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Feel glutes, full lockout',
          },
          {
            weight: '120 kg',
            reps: '10\u201315',
            rest: '90s',
            rpe: '7\u20138',
            rpeClass: 'low',
            type: 'working',
            notes: 'Progressive start: 120 week 1\u20132.',
          },
          {
            weight: '120 kg',
            reps: '10\u201315',
            rest: '90s',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes:
              'Full hip extension, 1s squeeze at top. Drive through heels.',
          },
          {
            weight: '120 kg',
            reps: '10\u201315',
            rest: '90s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes:
              'When 15-15-15, go to 130. Then 140 by week 5.',
          },
        ],
        formTips: [
          'Drive through heels, full hip extension with a hard glute squeeze at lockout \u2014 peak glute EMG occurs at top-range lockout. (Contreras et al. 2011, J Appl Biomech)',
          'Posterior pelvic tilt at the top \u2014 prevents lumbar hyperextension and maximizes glute activation. (Contreras et al. 2015, JSCR)',
          'Shins roughly vertical at the top \u2014 too far forward = hamstring dominant, too close = quad dominant. (Contreras et al. 2011)',
        ],
        progression: {
          targetReps: [15, 15, 15],
          nextWeight: 130,
          rawText:
            'When 15-15-15, go to 130. Then 140 by week 5.',
        },
        repRange: [10, 15],
      },

      // ── Exercise 5: Lever Seated Calf Raise ──
      {
        num: 5,
        name: 'Lever Seated Calf Raise',
        researchNote:
          'REP RANGE: 15\u201320 \u00b7 Seated = knee flexed = targets SOLEUS. Soleus is >80% slow-twitch. Higher reps + time under tension optimal. Standing calf on Lower A covers gastrocnemius.',
        sets: [
          {
            weight: '35 kg',
            reps: '8',
            rest: '45s',
            rpe: '\u2014',
            rpeClass: 'none',
            type: 'warmup',
            notes: 'Full ROM stretch',
          },
          {
            weight: '45 kg',
            reps: '15\u201320',
            rest: '60s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes: 'Soleus needs SLOW reps, not heavy load.',
          },
          {
            weight: '45 kg',
            reps: '15\u201320',
            rest: '60s',
            rpe: '9',
            rpeClass: 'high',
            type: 'working',
            notes:
              '2s pause at bottom stretch. When 20-20-20, go to 50.',
          },
          {
            weight: '45 kg',
            reps: '15\u201320',
            rest: '60s',
            rpe: '9\u201310',
            rpeClass: 'max',
            type: 'working',
            notes:
              'Last set to failure. Full ROM > load for calves.',
          },
        ],
        formTips: [
          'Knees bent at ~90\u00b0 \u2014 this reduces gastrocnemius contribution and preferentially loads the soleus. (Signorile et al. 2002, JSCR)',
          'Full ROM from deep stretch at the bottom to peak contraction at top \u2014 partial reps reduce soleus time under tension. (McMahon et al. 2014, Eur J Appl Physiol)',
          'No bouncing \u2014 ballistic reps increase Achilles tendon peak forces without proportionally increasing soleus activation. (Riemann et al. 2011, JSCR)',
        ],
        progression: {
          targetReps: [20, 20, 20],
          nextWeight: 50,
          rawText: 'When 20-20-20, go to 50.',
        },
        repRange: [15, 20],
      },

      // ── Exercise 6: Cable Crunch (or Lever Seated Crunch) ──
      {
        num: 6,
        name: 'Cable Crunch (or Lever Seated Crunch)',
        researchNote:
          'REP RANGE: 12\u201320 \u00b7 Abs = slow-twitch, respond to volume. Cable crunch = loaded, can progress. Don\u2019t pull with arms \u2014 crunch through the abs.',
        sets: [
          {
            weight: '40 kg',
            reps: '12\u201320',
            rest: '60s',
            rpe: '8',
            rpeClass: 'mid',
            type: 'working',
            notes: '40 kg lets you hit top of range.',
          },
          {
            weight: '40 kg',
            reps: '12\u201320',
            rest: '60s',
            rpe: '8\u20139',
            rpeClass: 'high',
            type: 'working',
            notes:
              'Exhale hard on each crunch. Feel abs, not hip flexors.',
          },
          {
            weight: '40 kg',
            reps: '12\u201320',
            rest: '60s',
            rpe: '9\u201310',
            rpeClass: 'max',
            type: 'working',
            notes: 'When 20-20-20, go to 45.',
          },
        ],
        formTips: [
          'Focus on spinal flexion (curl ribcage toward pelvis), NOT hip flexion \u2014 hip-dominant movement shifts work to hip flexors. (Escamilla et al. 2006, J Orthop Sports Phys Ther)',
          'Lock hips in place and don\u2019t sit back toward heels \u2014 the crunch happens entirely through trunk curling. (Kompf & Arandjelovic 2017, Sports Med)',
          'Hold the rope at a fixed position near head/neck \u2014 don\u2019t pull with arms or you\u2019ll recruit lats instead of abs. (Escamilla et al. 2006)',
        ],
        progression: {
          targetReps: [20, 20, 20],
          nextWeight: 45,
          rawText: 'When 20-20-20, go to 45.',
        },
        repRange: [12, 20],
      },
    ],
  },
];
