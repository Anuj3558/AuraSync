export const SecurityManager = {
  enableFullscreen: () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  },

  exitFullscreen: () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  },

  preventTabSwitch: () => {
    const handleKeyDown = (e) => {
      // Prevent Alt+Tab, Ctrl+Tab, Windows key
      if ((e.altKey && e.keyCode === 9) || 
          (e.ctrlKey && e.keyCode === 9) ||
          e.keyCode === 91 || e.keyCode === 92) {
        e.preventDefault();
        return false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert("Warning: Tab switching detected! Please return to the interview.");
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  },

  preventPaste: (inputRef) => {
    const handlePaste = (e) => {
      e.preventDefault();
      alert("Paste is not allowed during the interview. Please type your answer.");
      return false;
    };

    if (inputRef.current) {
      inputRef.current.addEventListener('paste', handlePaste);
      return () => {
        if (inputRef.current) {
          inputRef.current.removeEventListener('paste', handlePaste);
        }
      };
    }
  }
};