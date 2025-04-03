import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/App.js
import ImageUpload from './controllers/ImageUpload.js';
import './App.css'; // Import a CSS file for styling
function App() {
    return (_jsxs("div", { className: "App", children: [_jsx("header", { className: "App-header", children: _jsx("h1", { children: "PhotoTrace App" }) }), _jsx("main", { className: "App-main", children: _jsx(ImageUpload, {}) }), _jsx("footer", { className: "App-footer", children: _jsx("p", { children: "\u00A9 2023 Photo Trace. All rights reserved." }) })] }));
}
export default App;
