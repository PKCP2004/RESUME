/* ================================================================
   TECH NETWORK EFFECT — replaces snow
   Floating nodes connected by lines, repulse on hover
   Gold colour to match the portfolio theme
================================================================ */
particlesJS("particles-js", {
  "particles": {
    "number": { "value": 55, "density": { "enable": true, "value_area": 900 } },
    "color": { "value": "#C9A84C" },
    "shape": { "type": "circle" },
    "opacity": {
      "value": 0.35, "random": true,
      "anim": { "enable": true, "speed": 0.6, "opacity_min": 0.08, "sync": false }
    },
    "size": {
      "value": 2.5, "random": true,
      "anim": { "enable": false }
    },
    "line_linked": {
      "enable": true,
      "distance": 160,
      "color": "#C9A84C",
      "opacity": 0.12,
      "width": 1
    },
    "move": {
      "enable": true, "speed": 0.7, "direction": "none",
      "random": true, "straight": false, "out_mode": "bounce",
      "bounce": false,
      "attract": { "enable": false }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": { "enable": true, "mode": "grab" },
      "onclick": { "enable": true, "mode": "push" },
      "resize": true
    },
    "modes": {
      "grab": { "distance": 180, "line_linked": { "opacity": 0.4 } },
      "push": { "particles_nb": 3 },
      "repulse": { "distance": 120 }
    }
  },
  "retina_detect": true
});
