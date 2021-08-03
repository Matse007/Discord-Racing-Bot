module.exports = {
  name: "seed",
  description:
    "this command is used to generate a random bingo card seed for A Hat in Time Bingo",
  hidden: false,
  execute(message, args) {
    message.channel.send(
      "https://shockwve.github.io/?seed=" +
        Math.floor(Math.random() * 999999) +
        1
    );
  },
};
