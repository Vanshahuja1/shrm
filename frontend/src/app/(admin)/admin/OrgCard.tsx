import { ArrowRight, Code, Pencil, Trash } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axiosInstance";
import { Organization } from "./page";
import NewOrganizationModal from './NewOrganizationModal';

// Define color themes for cards
const colorThemes = [
    {
      gradient: "from-gray-700 to-gray-800",
      iconBg: "bg-white",
      iconColor: "text-gray-700",
      arrowColor: "text-gray-700",
      editButton: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      deleteButton: "bg-red-100 text-red-600 hover:bg-red-200"
    },
    {
      gradient: "from-blue-800 to-blue-900",
      iconBg: "bg-white",
      iconColor: "text-blue-800",
      arrowColor: "text-blue-800",
      editButton: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      deleteButton: "bg-red-100 text-red-600 hover:bg-red-200"
    },
    {
        gradient: "from-yellow-700 to-yellow-800",
        iconBg: "bg-white",
        iconColor: "text-yellow-800",
        arrowColor: "text-yellow-800",
        editButton: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        deleteButton: "bg-red-100 text-red-600 hover:bg-red-200"
      }
    
  ];
  

function OrgCard({ org, fetchOrgs, index = 0 }: { org: Organization, fetchOrgs: () => void, index?: number }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // Get color theme based on index
  const theme = colorThemes[index % colorThemes.length];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Open modal and prefill form
  const handleUpdate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
  };

  // Delete organization
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${org.name}?`)) {
      await axios.delete(`/organizations/${org._id}`);
      fetchOrgs();
      alert(`${org.name} deleted`);
    }
  };

  return (
    <>
      <div
        
        className="group bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 transform"
      >
        <div className={`bg-gradient-to-r ${theme.gradient} p-6 text-center relative overflow-hidden`}>
          {/* Decorative background pattern */}
          <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className={`w-16 h-16 ${theme.iconBg} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg relative z-10`}>
            <Code className={`w-8 h-8 ${theme.iconColor}`} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 relative z-10 group-hover:text-gray-100 transition-colors duration-300">
            {org.name}
          </h3>
        </div>
        
        <div className="px-6 py-3 bg-gradient-to-b from-gray-50 to-white">
          <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-3">
            {org.description}
          </p>
          
          {/* Additional info if available */}
          {(org.address || org.contactEmail || org.website) && (
            <div className="mb-4 space-y-1">
             
              {org.contactEmail && (
                <p className="text-xs text-gray-500 truncate">✉️ {org.contactEmail}</p>
              )}
             </div>
          )}
          
          <div onClick={() => handleNavigation(`/admin/${org.url}`)} 
           className={`flex items-center ${theme.arrowColor} font-medium group-hover:translate-x-2 transition-transform duration-300 mb-4`}>
            <span className="text-sm">View Details</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
          
          <div className="flex gap-3 justify-end">
            {/* Edit (Update) Icon */}
            <button
              aria-label="Edit Organization"
              className="p-2 bg-white border border-gray-200 text-gray-600 rounded-full hover:bg-gray-100 transition flex items-center justify-center cursor-pointer"
              onClick={e => { e.stopPropagation(); handleUpdate(e); }}
            >
              <Pencil className="w-5 h-5" />
            </button>
            {/* Delete Icon */}
            <button
              aria-label="Delete Organization"
              className="p-2 bg-white border border-gray-200 text-red-600 rounded-full hover:bg-red-50 transition flex items-center justify-center cursor-pointer"
              onClick={e => { e.stopPropagation(); handleDelete(e); }}
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Unified Modal for Edit */}
      {showModal && (
        <NewOrganizationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchOrgs();
          }}
          organization={{
            _id: org._id,
            name: org.name,
            description: org.description || '',
            address: org.address || '',
            contactEmail: org.contactEmail || '',
            contactPhone: org.contactPhone || '',
            website: org.website || ''
          }}
          isEdit={true}
        />
      )}
    </>
  );
}

export default OrgCard;