<div id="top"></div>
<!--
*** This README was created with https://github.com/othneildrew/Best-README-Template
-->



<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">Minella</h3>

  <p align="center">
    Minella is a minesweeper application with multiple game modes and difficulty levels.
    <br />
    <br />
    <a href="https://github.com/lenra-io/app-minella/issues">Report Bug</a>
    ·
    <a href="https://github.com/lenra-io/app-minella/issues">Request Feature</a>
  </p>
</div>




<!-- GETTING STARTED -->

## Prerequisites

To properly run this application, make sure that `npm` is installed on your computer.
Then, run `npm i` at the root of the application to install all of the dependencies needed to run Minella.

You will also need `docker`. Installation instructions can be found here https://docs.docker.com/engine/install/.

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage

Use this command to run Minella :
```console
docker run -it --rm -p 4000:4000 -v "${PWD}:/home/app/function" lenra/devtools-node12:beta
```

You can then access the application by opening [`localhost:4000`](http://localhost:4000) on your web browser. 

### Single player

This game mode is just the classical minesweeper game.

### Versus

In this game mode, two players are fighting to get the highest score.
Each player starts with a score of 0 and win one point for each successfully revealed cell.
The players take turns and the flags are personnal.
If a player reveals a bomb he lose the game (or lose 10 points ?).
When all the cells are revealed minus the bomb ones the player with the highest score wins.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please open an issue with the tag "enhancement".
Don't forget to give the project a star if you liked it! Thanks again!

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the **MIT** License. See [LICENSE](./LICENSE) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Lenra - [@lenra_dev](https://twitter.com/lenra_dev) - contact@lenra.io

Project Link: [https://github.com/lenra-io/app-minella](https://github.com/lenra-io/app-minella)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/lenra-io/app-minella.svg?style=for-the-badge
[contributors-url]: https://github.com/lenra-io/app-minella/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/lenra-io/app-minella.svg?style=for-the-badge
[forks-url]: https://github.com/lenra-io/app-minella/network/members
[stars-shield]: https://img.shields.io/github/stars/lenra-io/app-minella.svg?style=for-the-badge
[stars-url]: https://github.com/lenra-io/app-minella/stargazers
[issues-shield]: https://img.shields.io/github/issues/lenra-io/app-minella.svg?style=for-the-badge
[issues-url]: https://github.com/lenra-io/app-minella/issues
[license-shield]: https://img.shields.io/github/license/lenra-io/app-minella.svg?style=for-the-badge
[license-url]: https://github.com/lenra-io/app-minella/blob/master/LICENSE

