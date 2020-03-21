function changeTheme(color) {
    $("aside .theme").addClass("hidden")
    $("aside .theme button::after").addClass(color)
}