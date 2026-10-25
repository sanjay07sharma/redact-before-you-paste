/* Applies the chosen theme before first paint, so a reload (e.g. after a wipe) keeps it without a flash.
   The choice lives only in the URL (#dark / #light), never in storage. Classic script: it must block. */
(function () {
  var theme = location.hash.slice(1);
  if (theme === "dark" || theme === "light") document.documentElement.dataset.theme = theme;
})();
