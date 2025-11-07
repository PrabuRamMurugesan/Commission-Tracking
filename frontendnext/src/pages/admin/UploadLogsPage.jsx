import React, { useState, useRef, useEffect } from "react";
import { FaArrowUp, FaRegEye } from "react-icons/fa";
import { LuArrowUp10 } from "react-icons/lu";
import { VscActivateBreakpoints } from "react-icons/vsc";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { ImUpload } from "react-icons/im";
const UploadLogsPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/upload-logs").then((res) => setLogs(res.data.logs));
  }, []);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const tableContainerRef = useRef(null);

  // Handle scroll detection
  const handleScroll = () => {
    if (tableContainerRef.current.scrollTop > 200) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  // Attach scroll listener
  useEffect(() => {
    const tableDiv = tableContainerRef.current;
    if (tableDiv) {
      tableDiv.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (tableDiv) {
        tableDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    tableContainerRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <div className="d-flex flex-row vh-100 vw-100">
        <Sidebar />
        <div className="d-flex align-items-center justify-content-start vh-100 vw-100 my-5 p-4">
          <div className="container mt-4 h-100 w-100 ">
            <div className="d-flex  align-items-center gap-3 p-3 mb-4 border-bottom">
              <ImUpload size={25} />
              <h3>Upload Logs</h3>
            </div>
            <div className="position-relative">
              <div
                className="table-responsive"
                ref={tableContainerRef}
                style={{
                  maxHeight: "500px",
                  overflowY: "auto",
                  maxHeight: "500px",
                  overflowY: "auto",
                  overflowX: "auto", // ✅ enable x-scroll
                  WebkitOverflowScrolling: "touch", // ✅ smooth scroll for touch devices
                  cursor: "grab", // 👆 optional: shows grab cursor
                }}
                onMouseDown={(e) => {
                  const el = e.currentTarget;
                  let startX = e.pageX - el.offsetLeft;
                  let scrollLeft = el.scrollLeft;

                  const handleMouseMove = (ev) => {
                    ev.preventDefault();
                    const x = ev.pageX - el.offsetLeft;
                    const walk = (x - startX) * 1; // scroll speed multiplier
                    el.scrollLeft = scrollLeft - walk;
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener("mousemove", handleMouseMove);
                    document.removeEventListener("mouseup", handleMouseUp);
                  };

                  document.addEventListener("mousemove", handleMouseMove);
                  document.addEventListener("mouseup", handleMouseUp);
                }}
              >
                <table className="table table-bordered">
                  <thead
                    className="table-dark "
                    style={{ position: "sticky", top: 0, zIndex: 1 }}
                  >
                    <tr className="text-nowrap">
                      <th>#</th>
                      <th>File Name</th>
                      <th>Uploaded By</th>
                      <th>Valid</th>
                      <th>Flagged</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, idx) => (
                      <tr key={idx}>
                        <td>{agent._id}</td>
                        <td>{log.fileName}</td>
                        <td>{log.uploadedBy || "N/A"}</td>
                        <td>{log.validCount}</td>
                        <td>{log.flaggedCount}</td>
                        <td>{log.totalRows}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="btn btn-dark rounded-circle shadow position-absolute d-flex align-items-center justify-content-center "
            style={{
              bottom: "20px",
              right: "20px",
              width: "40px",
              height: "40px",
              zIndex: 10,
            }}
          >
            <FaArrowUp />
          </button>
        )}
      </div>
    </>
  );
};

export default UploadLogsPage;
