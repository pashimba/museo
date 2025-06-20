<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900 p-4">
    <div
      id="game-container"
      ref="gameContainer"
      class="relative w-full max-w-[800px] aspect-w-4 aspect-h-3 bg-black rounded-lg shadow-2xl overflow-hidden"
      :style="{ width: gameWidth + 'px', height: gameHeight + 'px' }"
    >
      <!-- El lienzo de Phaser se inyectará aquí -->
    </div>
  </div>
</template>

<script>
import * as Phaser from "phaser";

// Define colores globales para usar en Phaser y en Vue
const COLORS = {
  WHITE: 0xffffff,
  BLACK: 0x000000,
  GREEN: 0x00c800,
  BRIGHT_GREEN: 0x00ff00,
  RED: 0xc80000,
  BRIGHT_RED: 0xff0000,
  BLUE: 0x0000c8,
  BRIGHT_BLUE: 0x0000ff,
  LIGHT_GRAY: 0xc8c8c8,
  DARK_GRAY: 0x646464, // (100, 100, 100) en RGB es 0x646464 en hexadecimal
  YELLOW: 0xffff00,
  ORANGE: 0xffb400,
  TRANSPARENT_BLACK_ALPHA: 0.7, // Para overlays en canvas
};

// URLs de los assets proporcionadas por el usuario
const ASSET_URLS = {
  fondo: "https://i.imgur.com/ioK3FKP.png",
  fondoB:
    "https://static1.evcdn.net/cdn-cgi/image/width=3840,height=2880,quality=70,fit=crop/offer/raw/2022/11/17/7bbd64d5-a44b-47b0-9933-5ecc3b39005b.jpg",
  juanito:
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f3ebcf88-7437-4c07-ac43-e6f2b50fb766/db5q7sb-20590550-0c8d-4d25-ba00-295763af8a9c.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY2NDM3M2E1ZjBkNDFhMGQyNmUwIiwib2JqIjpbW3sicGF0aCI6IlwvZlwvZjNlYmNmODgtNzQzNy00YzA3LWFjNDMtZTZmMjBiNTBmYjc2NlwvZGI1cTdzYi0yMDU5MDU1MC0wYzhkLTRkMjUtYmEwMC0yOTU3NjNhZjhhOWMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQifV0.7o_bWBloW8FzBQVEBrkx3IDrg-nxygSZJHPKhvSU6VM",
  carly:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/02_-_Antonio_Jos%C3%A9_de_Sucre_%28CROPPED%29.png/1200px-02_-_Antonio_Jos%C3%A9_de_Sucre_%28CROPPED%29.png",
  carlos:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Jos%C3%A9_Mar%C3%ADa_P%C3%Aérez_de_Urdininea._Anonymous_author._c._1900s%2C_Palacio_Quemado%2C_La_Paz.png/960px-Jos%C3%A9_Mar%C3%ADa_P%C3%Aérez_de_Urdininea._Anonymous_author._c._1900s%2C_Palacio_Quemado%2C_La_Paz.png",
  pedro:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/04c_-_Jos%C3%A9_Miguel_de_Velasco.png/1200px-04c_-_Jos%C3%A9_Miguel_de_Velasco.png",
  dialog_box:
    "https://e7.pngegg.com/pngimages/397/442/png-clipart-dialog-box-video-game-dialogue-game-box-game-angle.png",
  obj1: "https://png.pngtree.com/png-vector/20240103/ourmid/pngtree-wooden-panpipe-for-making-music-graphic-png-image_11268486.png",
  obj2: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Monolito_Ponce_en_Tiwanaku_-_Bolivia.jpg",
  obj3: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjEBg4OKRsKZxco4UddsTbrhV1aLuKko3TzQ&s", // URL corrected: removed trailing spaces/newlines
  obj4: "https://static.vecteezy.com/system/resources/thumbnails/049/547/733/small/brown-alpaca-isolated-on-transparent-background-png.png",
  // NOTA: Phaser no puede reproducir directamente videos de YouTube.
  // La música se cargará desde la carpeta de assets local.
  background_music: "assets/fondo.mp3", // Ruta local para la música
  star: "https://labs.phaser.io/assets/particles/star.png", // Para fuegos artificiales
};

// --- Configuración del Juego Global ---
const GameConfig = {
  width: 800,
  height: 600,
  player_lives: 10,
  player_score: 0,
  player_name: "",
  all_time_scores: [],
  questions_data: {
    Juanito: {
      question: "¿Quién fue el primer presidente de Bolivia?",
      correct: "Simón Bolívar",
      options: [
        "Antonio José de Sucre",
        "Andrés de Santa Cruz",
        "José Ballivián",
      ],
    },
    Carly: {
      question: "¿En qué año se fundó la ciudad de La Paz?",
      correct: "1548",
      options: ["1825", "1781", "1492"],
    },
    Carlos: {
      question: "Actualmente, ¿Cuántos departamentos tiene Bolivia?",
      correct: "9",
      options: ["7", "8", "10"],
    },
    Pedro: {
      question:
        "¿Qué importante batalla se libró en 1824 que consolidó la independencia de Bolivia?",
      correct: "Batalla de Ayacucho",
      options: ["Batalla de Junín", "Batalla de Tumusla", "Batalla de Ingavi"],
    },
  },
  chronological_order_names: ["Juanito", "Carly", "Pedro", "Carlos"],

  // Nivel 2 (Búsqueda de Objetos)
  object_hunt_timer_initial: 30,

  // Nivel 3 (Orden Cronológico)
  level3_attempts_initial: 3,

  // Nivel 4 (Rompecabezas)
  puzzle_rows: 3,
  puzzle_cols: 3,
  puzzle_timer_initial: 40,

  // Estados de los personajes (para Nivel 1)
  character_states: {
    Juanito: { question_asked: false, attempts: 0 },
    Carly: { question_asked: false, attempts: 0 },
    Carlos: { question_asked: false, attempts: 0 },
    Pedro: { question_asked: false, attempts: 0 },
  },
};

GameConfig.firework_colors = [
  COLORS.RED,
  COLORS.GREEN,
  COLORS.BLUE,
  COLORS.YELLOW,
  0xff00ff, // Magenta
  0x00ffff,
  0xff8000,
  0x8000ff,
  0x0080ff,
  COLORS.WHITE,
];

// --- Funciones de Utilidad ---
function loadScores() {
  try {
    const scores = JSON.parse(localStorage.getItem("boliviaGameScores")) || [];
    return scores;
  } catch (e) {
    console.error("Error loading scores from localStorage:", e);
    return [];
  }
}

function saveScores(scores) {
  try {
    localStorage.setItem("boliviaGameScores", JSON.stringify(scores));
  } catch (e) {
    console.error("Error saving scores to localStorage:", e);
  }
}

function getPlayerRank(scores, current_player_score, player_name) {
  const sorted_scores = [...scores].sort((a, b) => b.score - a.score);
  let rank = 1;
  let found_player_exact_entry = false;

  for (let i = 0; i < sorted_scores.length; i++) {
    if (sorted_scores[i].score > current_player_score) {
      rank++;
    } else if (
      !found_player_exact_entry &&
      sorted_scores[i].score === current_player_score &&
      sorted_scores[i].name === player_name
    ) {
      found_player_exact_entry = true; // Found an exact match for the current player's entry
      return rank;
    } else if (sorted_scores[i].score <= current_player_score) {
      // If current player's score is equal or higher than current entry, this is their rank
      return rank;
    }
  }
  return rank; // If player's score is highest or if list is empty
}

// --- ESCENAS DE PHASER ---

// Escena Base para métodos comunes (botones, UI)
class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  createButton(
    x,
    y,
    width,
    height,
    text,
    color,
    hoverColor,
    action,
    arg = null
  ) {
    const button = this.add
      .rectangle(x, y, width, height, color)
      .setInteractive()
      .on("pointerover", () => button.setFillStyle(hoverColor))
      .on("pointerout", () => button.setFillStyle(color))
      .on("pointerdown", () => {
        if (action) {
          if (arg !== null) {
            action(arg);
          } else {
            action();
          }
        }
      });

    const textObj = this.add
      .text(x, y, text, {
        fontFamily: "timesnewroman",
        fontSize: "20px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    return { button, textObj };
  }

  // Método para mostrar vidas y puntos en la UI
  displayGameStats() {
    this.livesText = this.add.text(
      10,
      10,
      `Vidas: ${Math.max(0, this.registry.get("player_lives"))}`,
      {
        fontFamily: "timesnewroman",
        fontSize: "30px",
        color: "#ffff00",
      }
    );
    this.scoreText = this.add
      .text(
        this.game.config.width - 10,
        10,
        `Puntos: ${this.registry.get("player_score")}`,
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffff00",
        }
      )
      .setOrigin(1, 0);
  }

  updateGameStats() {
    if (this.livesText) {
      this.livesText.setText(
        `Vidas: ${Math.max(0, this.registry.get("player_lives"))}`
      );
    }
    if (this.scoreText) {
      this.scoreText.setText(`Puntos: ${this.registry.get("player_score")}`);
    }
  }
}

class InstructionsLevel1Scene extends BaseScene {
  constructor() {
    super("InstructionsLevel1");
  }

  create() {
    this.add
      .rectangle(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        COLORS.BLACK
      )
      .setOrigin(0);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 150,
        "¡Bienvenido al Trivia de Bolivia!",
        {
          fontFamily: "timesnewroman",
          fontSize: "48px",
          color: "#ffffff",
          align: "center",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 50,
        "Este es un trivia. Debes responder las preguntas",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 20,
        "de todos los personajes.",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 + 10,
        "Presiona 'A' para interactuar con ellos.",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 + 100,
        "Presiona ESPACIO para empezar",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffff00",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("ExploringScene");
    });
  }
}

class ExploringScene extends BaseScene {
  constructor() {
    super("ExploringScene");
    this.currentDialogueTarget = null;
  }

  preload() {
    // Cargar imágenes del fondo y personajes desde las URLs
    this.load.image("fondo", ASSET_URLS.fondo);
    this.load.image("juanito", ASSET_URLS.juanito);
    this.load.image("carly", ASSET_URLS.carly);
    this.load.image("carlos", ASSET_URLS.carlos);
    this.load.image("pedro", ASSET_URLS.pedro);
    this.load.image("player_char", ASSET_URLS.juanito); // Usamos la misma imagen para el jugador
    this.load.image("dialog_box", ASSET_URLS.dialog_box);
    this.load.audio("background_music", ASSET_URLS.background_music); // Ruta local para la música
    this.load.image("star", ASSET_URLS.star);
  }

  create() {
    // Inicializar el sistema de registro si no está ya
    if (!this.registry.has("player_lives")) {
      this.registry.set("player_lives", GameConfig.player_lives);
      this.registry.set("player_score", GameConfig.player_score);
      this.registry.set("character_states", GameConfig.character_states);
    }

    this.add
      .image(this.game.config.width / 2, this.game.config.height / 2, "fondo")
      .setDisplaySize(this.game.config.width, this.game.config.height);

    // Personaje principal
    this.player = this.physics.add
      .sprite(50, 50, "player_char")
      .setScale(0.0375)
      .setDepth(1); // Reducido a la mitad (0.05 -> 0.025) y añadido setDepth
    this.player.setCollideWorldBounds(true);

    // Personajes interactivos (reducidos a la mitad)
    this.personajes = this.add.group();
    this.juanito = this.add
      .sprite(150, 150, "juanito")
      .setScale(0.0375)
      .setData("name", "Juanito"); // Reducido a la mitad (0.075 -> 0.0375)
    this.carly = this.add
      .sprite(450, 250, "carly")
      .setScale(0.0375)
      .setData("name", "Carly"); // Reducido a la mitad
    this.carlos = this.add
      .sprite(600, 100, "carlos")
      .setScale(0.0375)
      .setData("name", "Carlos"); // Reducido a la mitad
    this.pedro = this.add
      .sprite(200, 400, "pedro")
      .setScale(0.0375)
      .setData("name", "Pedro"); // Reducido a la mitad
    this.personajes.addMultiple([
      this.juanito,
      this.carly,
      this.carlos,
      this.pedro,
    ]);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on("keydown-A", this.handleInteraction, this);

    this.displayGameStats();

    // Música
    // Corrección: this.sound ya es el gestor de sonido, no tiene una propiedad 'manager'
    if (this.sound.getAll("background_music").length > 0) {
      if (!this.music || !this.music.isPlaying) {
        this.music = this.sound.add("background_music", {
          loop: true,
          volume: 0.5,
        });
        this.music.play();
      }
    } else {
      console.warn(
        "Audio 'background_music' not found in cache. Skipping playback."
      );
    }

    // Comprobación de que el cuerpo de física del jugador existe
    if (!this.player.body) {
      console.error("ERROR: ¡El cuerpo de física del jugador no se creó!");
    }
  }

  update() {
    const moveSpeed = 4;

    // Asegúrate de que el jugador y su cuerpo de física existan antes de intentar moverlo
    if (!this.player || !this.player.body) {
      console.warn(
        "ADVERTENCIA: El jugador o su cuerpo de física no están disponibles en la actualización."
      );
      return; // Salir de la función update para evitar errores
    }

    this.player.setVelocity(0); // Reinicia la velocidad en cada fotograma

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-moveSpeed * 100);
      console.log(
        "Movimiento Izquierda: Velocidad X =",
        this.player.body.velocity.x,
        "Posición:",
        this.player.x,
        this.player.y
      );
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(moveSpeed * 100);
      console.log(
        "Movimiento Derecha: Velocidad X =",
        this.player.body.velocity.x,
        "Posición:",
        this.player.x,
        this.player.y
      );
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-moveSpeed * 100);
      console.log(
        "Movimiento Arriba: Velocidad Y =",
        this.player.body.velocity.y,
        "Posición:",
        this.player.x,
        this.player.y
      );
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(moveSpeed * 100);
      console.log(
        "Movimiento Abajo: Velocidad Y =",
        this.player.body.velocity.y,
        "Posición:",
        this.player.x,
        this.player.y
      );
    }

    this.currentDialogueTarget = null;
    const PROXIMITY_DISTANCE = 120;
    for (const personaje of this.personajes.getChildren()) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        personaje.x,
        personaje.y
      );
      if (distance < PROXIMITY_DISTANCE) {
        this.currentDialogueTarget = personaje;
        break;
      }
    }
  }

  handleInteraction() {
    if (this.currentDialogueTarget) {
      const characterName = this.currentDialogueTarget.getData("name");
      this.scene.start("DialogueScene", { characterName });
    }
  }
}

class DialogueScene extends BaseScene {
  constructor() {
    super("DialogueScene");
    this.characterName = null;
    this.dialogueTextObject = null;
    this.dialogueButtons = [];
    this.speakerImage = null;
  }

  create({ characterName }) {
    this.characterName = characterName;
    const charStates = this.registry.get("character_states");

    // Fondo de la escena anterior (simulado para mantener el contexto visual)
    this.add
      .image(this.game.config.width / 2, this.game.config.height / 2, "fondo")
      .setDisplaySize(this.game.config.width, this.game.config.height);

    // Re-add player and characters from ExploringScene for visual continuity
    const exploringScene = this.scene.get("ExploringScene");
    if (exploringScene) {
      this.player = this.add.existing(exploringScene.player);
      this.personajes = this.add.existing(exploringScene.personajes);
    }

    this.displayGameStats();

    const dialogBoxHeight = this.game.config.height / 3;
    const dialogBoxY = this.game.config.height - dialogBoxHeight;

    this.add
      .image(
        this.game.config.width / 2,
        dialogBoxY + dialogBoxHeight / 2,
        "dialog_box"
      )
      .setDisplaySize(this.game.config.width, dialogBoxHeight);

    // Configurar imagen del orador (speaker)
    let speakerKey;
    if (this.characterName === "Juanito") speakerKey = "juanito";
    else if (this.characterName === "Carly") speakerKey = "carly";
    else if (this.characterName === "Carlos") speakerKey = "carlos";
    else if (this.characterName === "Pedro") speakerKey = "pedro";

    if (speakerKey && this.textures.exists(speakerKey)) {
      this.speakerImage = this.add
        .image(this.game.config.width - 100, dialogBoxY + 50, speakerKey)
        .setScale(0.0375)
        .setOrigin(0.5); // Reducido a la mitad
    } else {
      console.warn(
        `Speaker image for ${this.characterName} (key: ${speakerKey}) not found in cache.`
      );
      this.speakerImage = this.add
        .image(this.game.config.width - 100, dialogBoxY + 50, "player_char")
        .setScale(0.0375)
        .setOrigin(0.5); // Fallback y ajuste de escala
    }

    // Diálogo
    let currentDialogue = "";
    const isQuestionAsked = charStates[this.characterName].question_asked;
    const q_data = GameConfig.questions_data[this.characterName];

    if (isQuestionAsked) {
      currentDialogue = `¡Ya me respondiste ${this.characterName}! Gracias por tu ayuda.`;
      this.addOkButton();
    } else if (q_data) {
      currentDialogue = q_data.question;
      this.addAnswerButtons(q_data);
    }

    this.dialogueTextObject = this.add
      .text(this.game.config.width / 2, dialogBoxY + 20, currentDialogue, {
        fontFamily: "timesnewroman",
        fontSize: "24px",
        color: "#000000",
        align: "center",
        wordWrap: { width: this.game.config.width - 40 },
      })
      .setOrigin(0.5, 0);
  }

  addOkButton() {
    const { button, textObj } = this.createButton(
      this.game.config.width / 2,
      this.game.config.height - 60,
      140,
      40,
      "Ok",
      COLORS.GREEN,
      COLORS.BRIGHT_GREEN,
      this.endDialogue.bind(this)
    );
    this.dialogueButtons.push(button, textObj);
  }

  addAnswerButtons(q_data) {
    const all_answers = [...q_data.options, q_data.correct];
    Phaser.Utils.Array.Shuffle(all_answers);

    const buttonWidth = 180;
    const buttonHeight = 40;
    const startYButtons =
      this.game.config.height - this.game.config.height / 3 + 80;

    const xPos1 = this.game.config.width / 2 - buttonWidth / 2 - 100;
    const xPos2 = this.game.config.width / 2 + buttonWidth / 2 + 100;

    all_answers.forEach((answer_text, i) => {
      const x_pos = i % 2 === 0 ? xPos1 : xPos2;
      const y_pos = startYButtons + Math.floor(i / 2) * (buttonHeight + 10);

      const { button, textObj } = this.createButton(
        x_pos,
        y_pos,
        buttonWidth,
        buttonHeight,
        answer_text,
        COLORS.BLUE,
        COLORS.BRIGHT_BLUE,
        this.checkAnswer.bind(this),
        answer_text === q_data.correct
      );
      this.dialogueButtons.push(button, textObj);
    });
  }

  clearDialogueButtons() {
    this.dialogueButtons.forEach((obj) => obj.destroy());
    this.dialogueButtons = [];
  }

  checkAnswer(is_correct) {
    let playerLives = this.registry.get("player_lives");
    let playerScore = this.registry.get("player_score");
    const charStates = this.registry.get("character_states");

    this.clearDialogueButtons();

    if (is_correct) {
      let points_earned = 0;
      charStates[this.characterName].attempts =
        (charStates[this.characterName].attempts || 0) + 1;

      if (charStates[this.characterName].attempts === 1) {
        points_earned = 50;
      } else if (charStates[this.characterName].attempts === 2) {
        points_earned = 30;
      } else {
        points_earned = 10;
      }
      playerScore += points_earned;
      charStates[this.characterName].question_asked = true;

      this.dialogueTextObject.setText("¡Correcto! ¡Excelente!");
      this.registry.set("player_score", playerScore);
      this.registry.set("character_states", charStates);

      this.addOkButton();

      const allAsked = Object.values(charStates).every(
        (state) => state.question_asked
      );
      if (allAsked) {
        this.dialogueTextObject.setText(
          "¡Has completado el Nivel 1! Preparando el siguiente..."
        );
        this.time.delayedCall(1500, () => {
          this.scene.start("InstructionsLevel2Scene");
        });
      }
    } else {
      playerLives -= 1;
      playerScore -= 30;
      this.registry.set("player_lives", playerLives);
      this.registry.set("player_score", playerScore);
      this.updateGameStats();

      if (playerLives <= 0) {
        this.dialogueTextObject.setText(
          "¡Incorrecto! No te quedan vidas. Game Over."
        );
        this.createButton(
          this.game.config.width / 2,
          this.game.config.height - 60,
          140,
          40,
          "Reiniciar",
          COLORS.RED,
          COLORS.BRIGHT_RED,
          this.resetGame.bind(this)
        );
      } else {
        this.dialogueTextObject.setText("Incorrecto. Intenta de nuevo.");
        const q_data = GameConfig.questions_data[this.characterName];
        if (q_data) {
          this.addAnswerButtons(q_data);
        }
      }
    }
    this.updateGameStats();
  }

  endDialogue() {
    this.scene.stop("DialogueScene");
    this.scene.resume("ExploringScene");
  }

  resetGame() {
    this.registry.set("player_lives", GameConfig.player_lives);
    this.registry.set("player_score", GameConfig.player_score);
    this.registry.set("player_name", GameConfig.player_name);
    this.registry.set("character_states", {
      Juanito: { question_asked: false, attempts: 0 },
      Carly: { question_asked: false, attempts: 0 },
      Carlos: { question_asked: false, attempts: 0 },
      Pedro: { question_asked: false, attempts: 0 },
    });

    this.scene.stop("ExploringScene");
    this.scene.start("InstructionsLevel1Scene");
  }
}

class InstructionsLevel2Scene extends BaseScene {
  constructor() {
    super("InstructionsLevel2");
  }

  preload() {
    this.load.image("fondoB", ASSET_URLS.fondoB);
  }

  create() {
    this.add
      .image(this.game.config.width / 2, this.game.config.height / 2, "fondoB")
      .setDisplaySize(this.game.config.width, this.game.config.height);

    this.add
      .rectangle(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        COLORS.BLACK,
        COLORS.TRANSPARENT_BLACK_ALPHA
      )
      .setOrigin(0);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 150,
        "¡Llegaste al Nivel 2!",
        {
          fontFamily: "timesnewroman",
          fontSize: "48px",
          color: "#ffffff",
          align: "center",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 50,
        "Ahora debes encontrar todos los objetos perdidos.",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 20,
        `¡El tiempo corre! Tienes ${GameConfig.object_hunt_timer_initial} segundos.`,
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 + 30,
        `Tus puntos y vidas se mantienen: Puntos ${this.registry.get(
          "player_score"
        )}, Vidas ${Math.max(0, this.registry.get("player_lives"))}`,
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffff00",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 + 120,
        "Presiona ESPACIO para empezar",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#00ff00",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("ObjectHuntScene");
    });
  }
}

class ObjectHuntScene extends BaseScene {
  constructor() {
    super("ObjectHuntScene");
    this.hiddenObjects = null;
    this.timerEvent = null;
    this.objectHuntTimerCurrent = GameConfig.object_hunt_timer_initial;
  }

  preload() {
    this.load.image("fondoB", ASSET_URLS.fondoB);
    this.load.image("obj1", ASSET_URLS.obj1);
    this.load.image("obj2", ASSET_URLS.obj2);
    this.load.image("obj3", ASSET_URLS.obj3);
    this.load.image("obj4", ASSET_URLS.obj4);
  }

  create() {
    this.add
      .image(this.game.config.width / 2, this.game.config.height / 2, "fondoB")
      .setDisplaySize(this.game.config.width, this.game.config.height);

    this.player = this.add.sprite(50, 50, "player_char").setScale(0.0375); // Reducido a la mitad

    this.hiddenObjects = this.add.group();
    const objectImages = ["obj1", "obj2", "obj3", "obj4"];
    objectImages.forEach((imgKey) => {
      const x = Phaser.Math.Between(50, this.game.config.width - 50);
      const y = Phaser.Math.Between(50, this.game.config.height - 50);
      const obj = this.add
        .sprite(x, y, imgKey)
        .setInteractive()
        .setData("found", false)
        .setScale(0.075); // Reducido a la mitad
      obj.on("pointerdown", () => this.findObject(obj));
      this.hiddenObjects.add(obj);
    });

    this.timerText = this.add
      .text(
        this.game.config.width / 2,
        20,
        `Tiempo: ${this.objectHuntTimerCurrent}`,
        {
          fontFamily: "timesnewroman",
          fontSize: "40px",
          color: "#ffff00",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    this.displayGameStats();
  }

  updateTimer() {
    this.objectHuntTimerCurrent--;
    this.timerText.setText(`Tiempo: ${this.objectHuntTimerCurrent}`);

    if (this.objectHuntTimerCurrent <= 0) {
      this.timerEvent.destroy();
      this.endLevel2();
    }
  }

  findObject(obj) {
    if (!obj.getData("found")) {
      obj.setData("found", true);
      obj.setVisible(false);
      let playerScore = this.registry.get("player_score");
      playerScore += 25;
      this.registry.set("player_score", playerScore);
      this.updateGameStats();

      if (this.hiddenObjects.countVisible() === 0) {
        this.timerEvent.destroy();
        this.endLevel2();
      }
    }
  }

  endLevel2() {
    if (this.hiddenObjects.countVisible() === 0) {
      this.add
        .text(
          this.game.config.width / 2,
          this.game.config.height / 2,
          "¡Nivel 2 Completado!",
          {
            fontFamily: "timesnewroman",
            fontSize: "40px",
            color: "#00ff00",
            fontStyle: "bold",
          }
        )
        .setOrigin(0.5);
    } else {
      this.add
        .text(
          this.game.config.width / 2,
          this.game.config.height / 2,
          "¡Tiempo agotado! Nivel 2 no completado.",
          {
            fontFamily: "timesnewroman",
            fontSize: "40px",
            color: "#ff0000",
            fontStyle: "bold",
          }
        )
        .setOrigin(0.5);
    }
    this.time.delayedCall(1500, () => {
      this.scene.start("InstructionsLevel3Scene");
    });
  }
}

class InstructionsLevel3Scene extends BaseScene {
  constructor() {
    super("InstructionsLevel3");
  }

  create() {
    this.add
      .image(this.game.config.width / 2, this.game.config.height / 2, "fondoB")
      .setDisplaySize(this.game.config.width, this.game.config.height);
    this.add
      .rectangle(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        COLORS.BLACK,
        COLORS.TRANSPARENT_BLACK_ALPHA
      )
      .setOrigin(0);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 150,
        "¡Llegaste al Nivel 3!",
        {
          fontFamily: "timesnewroman",
          fontSize: "48px",
          color: "#ffffff",
          align: "center",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 50,
        "Ahora debes ordenar los personajes cronológicamente.",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 20,
        "Haz clic sobre un personaje para arrastrarlo.",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 + 10,
        "Haz clic de nuevo para soltarlo.",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 + 40,
        "Cuando creas que están correctos, presiona 'V' para verificar.",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 + 70,
        `Tienes ${GameConfig.level3_attempts_initial} intentos. ¡Mucha suerte!`,
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffff00",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 + 140,
        "Presiona ESPACIO para empezar",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#00ff00",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("OrderingScene");
    });
  }
}

class OrderingScene extends BaseScene {
  constructor() {
    super("OrderingScene");
    this.draggableCharacters = null;
    this.currentDraggingChar = null;
    this.level3Attempts = GameConfig.level3_attempts_initial;
    this.level3Message = "";
    this.level3Completed = false;
    this.slotRects = [];
  }

  create() {
    this.add
      .image(this.game.config.width / 2, this.game.config.height / 2, "fondoB")
      .setDisplaySize(this.game.config.width, this.game.config.height);

    this.draggableCharacters = this.add.group();
    const initialX = 100;
    const initialYOffset = 100;
    const charSpacing = 70 + 30;

    const charactersToOrder = [
      { name: "Juanito", texture: "juanito" },
      { name: "Carly", texture: "carly" },
      { name: "Carlos", texture: "carlos" },
      { name: "Pedro", texture: "pedro" },
    ];
    Phaser.Utils.Array.Shuffle(charactersToOrder);

    charactersToOrder.forEach((charData, i) => {
      const char = this.add
        .sprite(initialX, initialYOffset + i * charSpacing, charData.texture)
        .setScale(0.0375) // Reducido a la mitad
        .setInteractive()
        .setData("name", charData.name)
        .setData("originalX", initialX)
        .setData("originalY", initialYOffset + i * charSpacing);

      this.input.setDraggable(char);
      this.draggableCharacters.add(char);
    });

    const LEVEL3_SLOT_Y_POSITIONS = [120, 220, 320, 420];
    const LEVEL3_SLOT_X = this.game.config.width / 2 - (70 * 1) / 2;
    this.slotRects = [];

    LEVEL3_SLOT_Y_POSITIONS.forEach((y_pos, i) => {
      const slotRect = this.add
        .rectangle(
          LEVEL3_SLOT_X + (70 * 1) / 2,
          y_pos + (70 * 1) / 2,
          70,
          70,
          COLORS.DARK_GRAY,
          0
        )
        .setStrokeStyle(2, COLORS.DARK_GRAY);
      this.slotRects.push(slotRect);

      this.add
        .text(LEVEL3_SLOT_X + (70 * 1) / 2, y_pos - 20, String(i + 1), {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffffff",
        })
        .setOrigin(0.5);
    });

    this.input.on("dragstart", (pointer, gameObject) => {
      this.currentDraggingChar = gameObject;
      gameObject.setDepth(1);
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragend", (pointer, gameObject) => {
      gameObject.setDepth(0);
      this.snapToSlot(gameObject);
      this.currentDraggingChar = null;
    });

    this.input.keyboard.on("keydown-V", this.checkLevel3Order, this);

    this.level3MessageText = this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height - 50,
        "Haz clic para arrastrar y suelta con otro clic.",
        {
          fontFamily: "timesnewroman",
          fontSize: "26px",
          color: "#ffb400",
          align: "center",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    this.displayGameStats();
    this.attemptsText = this.add.text(
      10,
      50,
      `Intentos: ${this.level3Attempts}`,
      {
        fontFamily: "timesnewroman",
        fontSize: "30px",
        color: "#ffff00",
      }
    );
  }

  snapToSlot(character) {
    let closestSlot = null;
    let minDist = Infinity;
    const tolerance = 50;

    this.slotRects.forEach((slot) => {
      const distance = Phaser.Math.Distance.Between(
        character.x,
        character.y,
        slot.x,
        slot.y
      );
      if (distance < minDist && distance < tolerance) {
        minDist = distance;
        closestSlot = slot;
      }
    });

    if (closestSlot) {
      character.x = closestSlot.x;
      character.y = closestSlot.y;
    }
  }

  checkLevel3Order() {
    if (this.currentDraggingChar || this.level3Completed) return;

    const sortedChars = this.draggableCharacters
      .getChildren()
      .sort((a, b) => a.y - b.y);
    const currentOrderNames = sortedChars.map((char) => char.getData("name"));

    let playerLives = this.registry.get("player_lives");
    let playerScore = this.registry.get("player_score");

    if (
      JSON.stringify(currentOrderNames) ===
      JSON.stringify(GameConfig.chronological_order_names)
    ) {
      playerScore += 200;
      this.registry.set("player_score", playerScore);
      this.updateGameStats();
      this.level3Message = "¡Orden Correcto! ¡Ganaste 200 puntos!";
      this.level3Completed = true;
      this.level3MessageText.setText(this.level3Message);
      this.level3MessageText.setColor("#00ff00");
      this.time.delayedCall(1500, () => {
        this.scene.start("InstructionsLevel4Scene");
      });
    } else {
      this.level3Attempts--;
      playerLives -= 2;
      this.registry.set("player_lives", playerLives);
      this.updateGameStats();
      this.attemptsText.setText(`Intentos: ${this.level3Attempts}`);

      this.level3Message = `¡Orden Incorrecto! -2 Vidas. Intentos restantes: ${this.level3Attempts}`;
      this.level3MessageText.setText(this.level3Message);
      this.level3MessageText.setColor("#ff0000");

      if (playerLives <= 0) {
        this.level3Message =
          "¡Perdiste el nivel! Se acabaron las vidas. Reiniciando...";
        this.level3MessageText.setText(this.level3Message);
        this.level3MessageText.setColor("#ff0000");
        this.level3Completed = true;
        this.time.delayedCall(2000, () => {
          this.scene.start("InstructionsLevel1Scene");
          this.resetGameGlobals();
        });
      } else if (this.level3Attempts <= 0) {
        this.level3Message = "¡Perdiste el nivel! Se acabaron los intentos.";
        this.level3MessageText.setText(this.level3Message);
        this.level3MessageText.setColor("#ff0000");
        this.level3Completed = true;
        this.time.delayedCall(1500, () => {
          this.scene.start("InstructionsLevel4Scene");
        });
      }
    }
  }

  resetGameGlobals() {
    this.registry.set("player_lives", GameConfig.player_lives);
    this.registry.set("player_score", GameConfig.player_score);
    this.registry.set("player_name", "");
    this.registry.set("character_states", {
      Juanito: { question_asked: false, attempts: 0 },
      Carly: { question_asked: false, attempts: 0 },
      Carlos: { question_asked: false, attempts: 0 },
      Pedro: { question_asked: false, attempts: 0 },
    });
    this.level3Attempts = GameConfig.level3_attempts_initial;
  }
}

class InstructionsLevel4Scene extends BaseScene {
  constructor() {
    super("InstructionsLevel4");
  }

  preload() {
    this.load.image("fondoB", ASSET_URLS.fondoB);
    this.load.image("puzzle_source", ASSET_URLS.dialog_box); // Usando dialog_box como imagen de rompecabezas
  }

  create() {
    this.add
      .image(this.game.config.width / 2, this.game.config.height / 2, "fondoB")
      .setDisplaySize(this.game.config.width, this.game.config.height);
    this.add
      .rectangle(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        COLORS.BLACK,
        COLORS.TRANSPARENT_BLACK_ALPHA
      )
      .setOrigin(0);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 150,
        "¡Llegaste al Nivel 4!",
        {
          fontFamily: "timesnewroman",
          fontSize: "48px",
          color: "#ffffff",
          align: "center",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 50,
        "Ahora debes armar un rompecabezas.",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 20,
        "Haz clic sobre una pieza para arrastrarla.",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 + 10,
        "Haz clic de nuevo para soltarla.",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 + 40,
        `Tienes ${GameConfig.puzzle_timer_initial} segundos para completarlo.`,
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffff00",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 + 70,
        "Si lo logras, ¡ganarás 300 puntos extra!",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffff00",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 + 140,
        "Presiona ESPACIO para empezar",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#00ff00",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("PuzzleScene");
    });
  }
}

class PuzzleScene extends BaseScene {
  constructor() {
    super("PuzzleScene");
    this.puzzlePieces = null;
    this.puzzleGridSlots = [];
    this.currentDraggingPuzzlePiece = null;
    this.puzzleTimerCurrent = GameConfig.puzzle_timer_initial;
    this.timerEvent = null;
    this.puzzleMessage =
      "Arma el rompecabezas. Haz clic para arrastrar y suelta con otro clic.";
    this.level4Completed = false;
  }

  create() {
    this.add
      .image(this.game.config.width / 2, this.game.config.height / 2, "fondoB")
      .setDisplaySize(this.game.config.width, this.game.config.height);

    this.puzzlePieces = this.add.group();
    this.createPuzzlePieces(
      "puzzle_source",
      GameConfig.puzzle_rows,
      GameConfig.puzzle_cols
    );

    this.timerText = this.add
      .text(
        this.game.config.width / 2,
        20,
        `Tiempo: ${this.puzzleTimerCurrent}`,
        {
          fontFamily: "timesnewroman",
          fontSize: "40px",
          color: "#000000",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    this.puzzleMessageText = this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height - 50,
        this.puzzleMessage,
        {
          fontFamily: "timesnewroman",
          fontSize: "26px",
          color: "#ffb400",
          align: "center",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    this.displayGameStats();

    this.input.on("dragstart", (pointer, gameObject) => {
      this.currentDraggingPuzzlePiece = gameObject;
      gameObject.setDepth(1);
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragend", (pointer, gameObject) => {
      gameObject.setDepth(0);
      this.snapToGrid(gameObject);
      this.currentDraggingPuzzlePiece = null;
      this.checkPuzzleCompletion();
    });
  }

  updateTimer() {
    this.puzzleTimerCurrent--;
    this.timerText.setText(`Tiempo: ${this.puzzleTimerCurrent}`);

    if (this.puzzleTimerCurrent <= 0 && !this.level4Completed) {
      this.timerEvent.destroy();
      this.puzzleMessage = "¡Tiempo agotado! Rompecabezas no completado.";
      let playerScore = this.registry.get("player_score");
      playerScore -= 200;
      this.registry.set("player_score", playerScore);
      this.updateGameStats();
      this.puzzleMessageText.setText(this.puzzleMessage);
      this.puzzleMessageText.setColor(COLORS.RED);
      this.level4Completed = true;
      this.time.delayedCall(1500, () => {
        this.scene.start("NameInputScene");
      });
    }
  }

  createPuzzlePieces(sourceImageKey, rows, cols) {
    const sourceImage = this.textures.get(sourceImageKey).getSourceImage();
    const puzzleDisplayWidth = 500;
    const puzzleDisplayHeight = parseInt(
      puzzleDisplayWidth * (sourceImage.height / sourceImage.width)
    );

    const pieceWidth = puzzleDisplayWidth / cols;
    const pieceHeight = puzzleDisplayHeight / rows;

    const puzzleTargetX = (this.game.config.width - puzzleDisplayWidth) / 2;
    const puzzleTargetY = (this.game.config.height - puzzleDisplayHeight) / 2;

    this.puzzleGridSlots = [];

    // El rectángulo se añade directamente sin asignarlo a una variable.
    this.add
      .rectangle(
        puzzleTargetX + puzzleDisplayWidth / 2,
        puzzleTargetY + puzzleDisplayHeight / 2,
        puzzleDisplayWidth,
        puzzleDisplayHeight,
        COLORS.WHITE
      )
      .setDepth(-1);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const xInImage = col * pieceWidth;
        const yInImage = row * pieceHeight;

        const correctScreenX = puzzleTargetX + xInImage;
        const correctScreenY = puzzleTargetY + yInImage;

        const rt = this.add.renderTexture(0, 0, pieceWidth, pieceHeight);
        rt.draw(sourceImageKey, xInImage, yInImage, pieceWidth, pieceHeight);

        const correctPos = {
          x: correctScreenX + pieceWidth / 2,
          y: correctScreenY + pieceHeight / 2,
        };

        const piece = this.add
          .sprite(0, 0, rt.texture.key)
          .setInteractive()
          .setData("correctX", correctPos.x)
          .setData("correctY", correctPos.y);

        this.input.setDraggable(piece);
        this.puzzlePieces.add(piece);

        this.add
          .rectangle(
            correctScreenX + pieceWidth / 2,
            correctScreenY + pieceHeight / 2,
            pieceWidth,
            pieceHeight,
            0,
            0
          )
          .setStrokeStyle(2, COLORS.DARK_GRAY);

        this.puzzleGridSlots.push({
          x: correctScreenX + pieceWidth / 2,
          y: correctScreenY + pieceHeight / 2,
          width: pieceWidth,
          height: pieceHeight,
        });
      }
    }

    const initialPositions = [];
    const gridSpacingX = pieceWidth + 20;
    const gridSpacingY = pieceHeight + 20;

    const totalGridWidth = cols * gridSpacingX - 20;
    const totalGridHeight = rows * gridSpacingY - 20;

    const gridStartX = this.game.config.width / 2 - totalGridWidth / 2;
    const gridStartY = this.game.config.height / 2 - totalGridHeight / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const xPos = gridStartX + c * gridSpacingX + pieceWidth / 2;
        const yPos = gridStartY + r * gridSpacingY + pieceHeight / 2;
        initialPositions.push({ x: xPos, y: yPos });
      }
    }
    Phaser.Utils.Array.Shuffle(initialPositions);

    let i = 0;
    this.puzzlePieces.getChildren().forEach((piece) => {
      if (initialPositions[i]) {
        piece.x = initialPositions[i].x;
        piece.y = initialPositions[i].y;
      }
      i++;
    });
  }

  snapToGrid(piece) {
    let min_dist = Infinity;
    let closest_slot = null;
    const tolerance = 20;

    this.puzzleGridSlots.forEach((slot) => {
      const dist = Phaser.Math.Distance.Between(
        piece.x,
        piece.y,
        slot.x,
        slot.y
      );
      if (dist < min_dist) {
        min_dist = dist;
        closest_slot = slot;
      }
    });

    if (closest_slot && min_dist < tolerance) {
      piece.x = closest_slot.x;
      piece.y = closest_slot.y;
    }
  }

  checkPuzzleCompletion() {
    let all_correct = true;
    const tolerance = 15;

    this.puzzlePieces.getChildren().forEach((piece) => {
      if (
        !(
          Math.abs(piece.x - piece.getData("correctX")) < tolerance &&
          Math.abs(piece.y - piece.getData("correctY")) < tolerance
        )
      ) {
        all_correct = false;
      }
    });

    if (all_correct && !this.level4Completed) {
      let playerScore = this.registry.get("player_score");
      playerScore += 300;
      this.registry.set("player_score", playerScore);
      this.updateGameStats();
      this.puzzleMessage = "¡Rompecabezas Resuelto! ¡Ganaste 300 puntos!";
      this.puzzleMessageText.setText(this.puzzleMessage);
      this.puzzleMessageText.setColor(COLORS.BRIGHT_GREEN);
      this.level4Completed = true;
      this.timerEvent.destroy();
      this.time.delayedCall(1500, () => {
        this.scene.start("NameInputScene");
      });
    }
  }
}

class NameInputScene extends BaseScene {
  constructor() {
    super("NameInputScene");
    this.player_name = "";
    this.nameInputText = null;
    this.cursor = null;
  }

  create() {
    this.add
      .rectangle(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        COLORS.BLACK
      )
      .setOrigin(0);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 100,
        "¡Juego Terminado!",
        {
          fontFamily: "timesnewroman",
          fontSize: "48px",
          color: "#ffffff",
          align: "center",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 20,
        "Ingresa tu nombre:",
        {
          fontFamily: "timesnewroman",
          fontSize: "36px",
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    const inputRectX = this.game.config.width / 2;
    const inputRectY = this.game.config.height / 2 + 55;
    const inputRectWidth = 300;
    const inputRectHeight = 50;

    this.add
      .rectangle(
        inputRectX,
        inputRectY,
        inputRectWidth,
        inputRectHeight,
        COLORS.LIGHT_GRAY
      )
      .setOrigin(0.5);
    this.add
      .rectangle(
        inputRectX,
        inputRectY,
        inputRectWidth,
        inputRectHeight,
        COLORS.WHITE
      )
      .setOrigin(0.5)
      .setStrokeStyle(3, COLORS.WHITE);

    this.nameInputText = this.add
      .text(
        inputRectX - inputRectWidth / 2 + 10,
        inputRectY,
        this.player_name,
        {
          fontFamily: "timesnewroman",
          fontSize: "36px",
          color: "#000000",
        }
      )
      .setOrigin(0, 0.5);

    this.cursor = this.add
      .line(0, 0, 0, 0, 0, 30, COLORS.BLACK)
      .setLineWidth(2)
      .setOrigin(0, 0.5);
    this.cursor.setVisible(false);

    this.time.addEvent({
      delay: 500,
      callback: () => {
        this.cursor.setVisible(!this.cursor.visible);
      },
      loop: true,
    });

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 + 120,
        "Presiona ENTER para continuar",
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffff00",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.input.keyboard.on("keydown", this.handleNameInput, this);
  }

  update() {
    const cursorX = this.nameInputText.x + this.nameInputText.width;
    this.cursor.x = cursorX;
    this.cursor.y = this.nameInputText.y;
  }

  handleNameInput(event) {
    if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
      if (this.player_name.trim()) {
        this.registry.set("player_name", this.player_name.trim());
        const allTimeScores = loadScores();
        allTimeScores.push({
          name: this.player_name.trim(),
          score: this.registry.get("player_score"),
        });
        saveScores(allTimeScores);
        this.registry.set("all_time_scores", allTimeScores);
        this.scene.start("ScoreboardScene");
      }
    } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE) {
      this.player_name = this.player_name.slice(0, -1);
      this.nameInputText.setText(this.player_name);
    } else if (
      this.player_name.length < 15 &&
      event.key.length === 1 &&
      event.key.match(/^[a-zA-Z0-9 ]*$/)
    ) {
      this.player_name += event.key;
      this.nameInputText.setText(this.player_name);
    }
  }
}

class ScoreboardScene extends BaseScene {
  constructor() {
    super("ScoreboardScene");
    this.fireworks = [];
  }

  create() {
    this.add
      .rectangle(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        COLORS.BLACK
      )
      .setOrigin(0);

    this.add
      .text(this.game.config.width / 2, 50, "¡Resultados Finales!", {
        fontFamily: "timesnewroman",
        fontSize: "48px",
        color: "#ffffff",
        align: "center",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const playerScore = this.registry.get("player_score");
    const playerName = this.registry.get("player_name");
    const allTimeScores = this.registry.get("all_time_scores");

    this.add
      .text(
        this.game.config.width / 2,
        100,
        `Tu Puntuación: ${playerScore} puntos`,
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#ffff00",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(this.game.config.width / 2, 150, "--- Mejores Puntuaciones ---", {
        fontFamily: "timesnewroman",
        fontSize: "30px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    const displayScores = [...allTimeScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    const scoreboardYStart = 190;
    displayScores.forEach((entry, i) => {
      const scoreLine = `${i + 1}. ${entry.name}: ${entry.score}`;
      this.add
        .text(
          this.game.config.width / 2,
          scoreboardYStart + i * 30,
          scoreLine,
          {
            fontFamily: "timesnewroman",
            fontSize: "24px",
            color: "#ffffff",
            align: "center",
          }
        )
        .setOrigin(0.5);
    });

    const currentRank = getPlayerRank(allTimeScores, playerScore, playerName);
    this.add
      .text(
        this.game.config.width / 2,
        scoreboardYStart + displayScores.length * 30 + 30,
        `¡Quedaste en el puesto: #${currentRank}!`,
        {
          fontFamily: "timesnewroman",
          fontSize: "30px",
          color: "#00ff00",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.createButton(
      this.game.config.width / 2,
      this.game.config.height - 100,
      140,
      50,
      "Salir (Q)",
      COLORS.RED,
      COLORS.BRIGHT_RED,
      () => {
        this.game.destroy(true);
      }
    );

    this.createButton(
      this.game.config.width / 2,
      this.game.config.height - 40,
      140,
      50,
      "Reiniciar",
      COLORS.BLUE,
      COLORS.BRIGHT_BLUE,
      this.resetGame.bind(this)
    );

    this.time.addEvent({
      delay: 500,
      callback: this.createFirework,
      callbackScope: this,
      loop: true,
    });
  }

  createFirework() {
    const x = Phaser.Math.Between(100, this.game.config.width - 100);
    const y = Phaser.Math.Between(100, this.game.config.height - 100);
    const color = Phaser.Utils.Array.GetRandom(
      GameConfig.firework_colors || [COLORS.RED, COLORS.BLUE, COLORS.GREEN]
    );

    const particles = this.add.particles("star");
    const emitter = particles.createEmitter({
      x,
      y,
      speed: { min: -400, max: 400 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: "ADD",
      active: true,
      lifespan: 600,
      gravityY: 500,
      quantity: 50,
      tint: color,
    });

    this.time.delayedCall(700, () => {
      emitter.stop();
    });
  }

  resetGame() {
    this.registry.set("player_lives", GameConfig.player_lives);
    this.registry.set("player_score", GameConfig.player_score);
    this.registry.set("player_name", "");
    this.registry.set("character_states", {
      Juanito: { question_asked: false, attempts: 0 },
      Carly: { question_asked: false, attempts: 0 },
      Carlos: { question_asked: false, attempts: 0 },
      Pedro: { question_asked: false, attempts: 0 },
    });

    this.scene.start("InstructionsLevel1Scene");
  }
}

export default {
  name: "BoliviaGame", // Nombre del componente Vue
  data() {
    return {
      phaserGame: null, // Instancia del juego Phaser
      gameWidth: GameConfig.width,
      gameHeight: GameConfig.height,
    };
  },
  mounted() {
    // Inicializar puntuaciones globales al montar el componente
    GameConfig.all_time_scores = loadScores();

    const config = {
      type: Phaser.AUTO,
      width: GameConfig.width,
      height: GameConfig.height,
      parent: "game-container", // ID del div donde se inyectará el lienzo
      physics: {
        default: "arcade",
        arcade: {
          debug: true, // Cambiado a TRUE para depuración visual del cuerpo de física
        },
      },
      scene: [
        InstructionsLevel1Scene,
        ExploringScene,
        DialogueScene,
        InstructionsLevel2Scene,
        ObjectHuntScene,
        InstructionsLevel3Scene,
        OrderingScene,
        InstructionsLevel4Scene,
        PuzzleScene,
        NameInputScene,
        ScoreboardScene,
      ],
      callbacks: {
        postBoot: (game) => {
          game.registry.set("player_lives", GameConfig.player_lives);
          game.registry.set("player_score", GameConfig.player_score);
          game.registry.set("player_name", GameConfig.player_name);
          game.registry.set("all_time_scores", GameConfig.all_time_scores);
          game.registry.set("character_states", GameConfig.character_states);
          game.registry.set("questions_data", GameConfig.questions_data);
        },
      },
    };

    // Crear la instancia del juego Phaser
    if (!this.phaserGame) {
      this.phaserGame = new Phaser.Game(config);
    }
  },
  beforeUnmount() {
    // Hook de ciclo de vida para limpiar antes de que el componente se desmonte
    if (this.phaserGame) {
      this.phaserGame.destroy(true);
      this.phaserGame = null;
    }
  },
};
</script>

<style scoped>
/* Asegúrate de que Tailwind CSS esté configurado en tu proyecto Vue para estas clases */
/* Si no usas Tailwind, reemplaza estas clases con tu CSS normal */
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.min-h-screen {
  min-height: 100vh;
}
.bg-gray-900 {
  background-color: #1a202c; /* Ejemplo de color gris oscuro */
}
.p-4 {
  padding: 1rem;
}
.relative {
  position: relative;
}
.w-full {
  width: 100%;
}
.max-w-\[800px\] {
  max-width: 800px;
}
.aspect-w-4 {
  /* Requires @tailwindcss/aspect-ratio plugin, or custom CSS for aspect ratio */
  aspect-ratio: 4 / 3;
}
.aspect-h-3 {
  /* Part of aspect-ratio plugin */
}
.bg-black {
  background-color: #000;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
.overflow-hidden {
  overflow: hidden;
}
</style>

