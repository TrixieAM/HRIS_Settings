const drawerWidth = 280;

const layoutStyles = {
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
    },
  },
  toolbar: {
    minHeight: "64px",
  },
  list: {
    padding: 0,
  },
  listItem: {
    color: "black",
    cursor: "pointer",
  },
  listItemIcon: {
    marginRight: "-1rem",
    minWidth: "40px",
  },
  listItemText: {
    fontSize: "16px",
    fontWeight: 500,
  },
  collapseContainer: {
    pl: 4,
  },
  expandedIcon: {
    marginLeft: "10rem",
  },
  logoutButton: {
    cursor: "pointer",
    color: "red",
  },
};

export default layoutStyles;
