import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const { id } = useParams();
  const adminUser = localStorage.getItem("adminUser");

  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate("/admin-login");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/category-edit-delete/${id}/`)
        .then((res) => res.json())
        .then((data) => {
            setCategoryName(data.category_name);
        })
        .catch((error) => {
            console.error(error);
            toast.error("Error fetching category data");
        });
  }, []);


  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:8000/api/category-edit-delete/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category_name: categoryName }),
    })
    .then((res) => res.json())
    .then((data) => {
        toast.success(data.message);
        // setCategoryName(data.category_name);
        setTimeout(() => {
            navigate("/manage-category");
        }, 1500);
    })
    .catch((error) => {
        console.error(error);
        toast.error("Error fetching category data");
    });
    
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="row">
        <div className="col-md-8">
          <div className="p-4 shadow-sm rounded">
            <h4 className="mb-4">
              <i className="fas fa-pen-square text-primary me-2"></i>Edit Food Category
            </h4>

            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Update Category Name"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary  mt-2">
                <i className="fas fa-save me-2"></i>Update Category
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <i
            className="fas fa-utensils"
            style={{ fontSize: "180px", color: "#e5e5e5" }}
          ></i>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditCategory;
