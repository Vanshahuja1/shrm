'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { User, Briefcase, DollarSign, FileText, Settings } from "lucide-react";

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: any;
    onSave: (updatedEmployee: any) => void;
}

export default function EditModal({ isOpen, onClose, employee, onSave }: EditModalProps) {
    const [formData, setFormData] = useState({
        personalInfo: {
            name: employee?.name || '',
            email: employee?.email || '',
            phone: employee?.phone || '',
            dateOfBirth: employee?.dob || '',
            gender: employee?.gender || '',
            aadhar: employee?.adharCard || '',
            pan: employee?.panCard || '',
            address: employee?.address || '',
            emergencyContact: employee?.emergencyContact || ''
        },
        financialInfo: {
            salary: employee?.salary?.toString() || '',
            bankInfo: {
                accountHolderName: employee?.bankDetails?.accountHolder || '',
                accountType: employee?.bankDetails?.accountType || '',
                accountNumber: employee?.bankDetails?.accountNumber || '',
                bankName: employee?.bankDetails?.bankName || '',
                ifscCode: employee?.bankDetails?.ifsc || '',
                branch: employee?.bankDetails?.branch || ''
            }
        },
        departmentInfo: {
            departmentName: employee?.departmentName || '',
            role: employee?.role || '',
            managerName: employee?.managers?.[0] || ''
        },
        joiningDetails: {
            joiningDate: employee?.joiningDate?.split('T')[0] || '',
        },
        payrollInfo: {
            taxCode: employee?.taxCode || '',
            benefits: employee?.benefits || ''
        },
        isActive: employee?.isActive !== undefined ? employee.isActive : true
    });

    const [activeTab, setActiveTab] = useState('personal');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-screen min-w-[70vw] max-h-[90vh] min-h-[60vh] overflow-hidden">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                        <User className="h-6 w-6" />
                        Edit Employee Details
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                        <TabsList className="grid w-full grid-cols-5 mb-6">
                            <TabsTrigger value="personal" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">Personal</span>
                            </TabsTrigger>
                            <TabsTrigger value="department" className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                <span className="hidden sm:inline">Department</span>
                            </TabsTrigger>
                            <TabsTrigger value="financial" className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                <span className="hidden sm:inline">Financial</span>
                            </TabsTrigger>
                            <TabsTrigger value="payroll" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="hidden sm:inline">Payroll</span>
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                <span className="hidden sm:inline">Settings</span>
                            </TabsTrigger>
                        </TabsList>

                        <ScrollArea className="flex-1 max-h-[60vh]">
                            {/* Personal Information Tab */}
                            <TabsContent value="personal" className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 ">
                                        Basic Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                value={formData.personalInfo.name}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    personalInfo: { ...formData.personalInfo, name: e.target.value }
                                                })}
                                                placeholder="Enter full name"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.personalInfo.email}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    personalInfo: { ...formData.personalInfo, email: e.target.value }
                                                })}
                                                placeholder="Enter email address"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                value={formData.personalInfo.phone}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    personalInfo: { ...formData.personalInfo, phone: e.target.value }
                                                })}
                                                placeholder="Enter phone number"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="dob">Date of Birth</Label>
                                            <Input
                                                id="dob"
                                                type="date"
                                                value={formData.personalInfo.dateOfBirth}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    personalInfo: { ...formData.personalInfo, dateOfBirth: e.target.value }
                                                })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="gender">Gender</Label>
                                            <Select
                                                value={formData.personalInfo.gender}
                                                onValueChange={(value) => setFormData({
                                                    ...formData,
                                                    personalInfo: { ...formData.personalInfo, gender: value }
                                                })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>
                                                Status
                                            </Label>
                                            <Select
                                                value={formData.isActive ? 'active' : 'inactive'}
                                                onValueChange={(value) => setFormData({
                                                    ...formData,
                                                    isActive: value === 'active'
                                                })}
                                            >
                                                <SelectTrigger className="max-w-xs">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="emergencyContact">Emergency Contact</Label>
                                            <Input
                                                id="emergencyContact"
                                                value={formData.personalInfo.emergencyContact}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    personalInfo: { ...formData.personalInfo, emergencyContact: e.target.value }
                                                })}
                                                placeholder="Emergency contact number"
                                            />
                                        </div>
                                    </div>

                                    <Separator className="my-6" />

                                    <h3 className="text-lg font-semibold text-gray-900 ">
                                        Identity Documents
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="aadhar">Aadhar Number</Label>
                                            <Input
                                                id="aadhar"
                                                value={formData.personalInfo.aadhar}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    personalInfo: { ...formData.personalInfo, aadhar: e.target.value }
                                                })}
                                                placeholder="Enter Aadhar number"
                                                maxLength={12}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="pan">PAN Number</Label>
                                            <Input
                                                id="pan"
                                                value={formData.personalInfo.pan}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    personalInfo: { ...formData.personalInfo, pan: e.target.value.toUpperCase() }
                                                })}
                                                placeholder="Enter PAN number"
                                                maxLength={10}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Textarea
                                            id="address"
                                            value={formData.personalInfo.address}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                personalInfo: { ...formData.personalInfo, address: e.target.value }
                                            })}
                                            placeholder="Enter complete address"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Department Information Tab */}
                            <TabsContent value="department" className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 ">
                                        Department & Role
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department *</Label>
                                            <Select
                                                value={formData.departmentInfo.departmentName}
                                                onValueChange={(value) => setFormData({
                                                    ...formData,
                                                    departmentInfo: { ...formData.departmentInfo, departmentName: value }
                                                })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                                    <SelectItem value="HR">Human Resources</SelectItem>
                                                    <SelectItem value="Finance">Finance</SelectItem>
                                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                                    <SelectItem value="Sales">Sales</SelectItem>
                                                    <SelectItem value="Operations">Operations</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="role">Role *</Label>
                                            <Select
                                                value={formData.departmentInfo.role}
                                                onValueChange={(value) => setFormData({
                                                    ...formData,
                                                    departmentInfo: { ...formData.departmentInfo, role: value }
                                                })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="manager">Manager</SelectItem>
                                                    <SelectItem value="senior">Senior Employee</SelectItem>
                                                    <SelectItem value="employee">Employee</SelectItem>
                                                    <SelectItem value="intern">Intern</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="manager">Reporting Manager</Label>
                                            <Input
                                                id="manager"
                                                value={formData.departmentInfo.managerName}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    departmentInfo: { ...formData.departmentInfo, managerName: e.target.value }
                                                })}
                                                placeholder="Enter manager name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="joiningDate">Joining Date</Label>
                                            <Input
                                                id="joiningDate"
                                                type="date"
                                                value={formData.joiningDetails.joiningDate}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    joiningDetails: { ...formData.joiningDetails, joiningDate: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Financial Information Tab */}
                            <TabsContent value="financial" className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 ">
                                        Salary Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="salary">Monthly Salary (₹)</Label>
                                            <Input
                                                id="salary"
                                                type="number"
                                                value={formData.financialInfo.salary}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    financialInfo: { ...formData.financialInfo, salary: e.target.value }
                                                })}
                                                placeholder="Enter monthly salary"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <Separator className="my-6" />

                                    <h3 className="text-lg font-semibold text-gray-900 ">
                                        Bank Details
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="accountHolder">Account Holder Name</Label>
                                            <Input
                                                id="accountHolder"
                                                value={formData.financialInfo.bankInfo.accountHolderName}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    financialInfo: {
                                                        ...formData.financialInfo,
                                                        bankInfo: { ...formData.financialInfo.bankInfo, accountHolderName: e.target.value }
                                                    }
                                                })}
                                                placeholder="Enter account holder name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="accountType">Account Type</Label>
                                            <Select
                                                value={formData.financialInfo.bankInfo.accountType}
                                                onValueChange={(value) => setFormData({
                                                    ...formData,
                                                    financialInfo: {
                                                        ...formData.financialInfo,
                                                        bankInfo: { ...formData.financialInfo.bankInfo, accountType: value }
                                                    }
                                                })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select account type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="SAVING">Savings</SelectItem>
                                                    <SelectItem value="CURRENT">Current</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="accountNumber">Account Number</Label>
                                            <Input
                                                id="accountNumber"
                                                value={formData.financialInfo.bankInfo.accountNumber}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    financialInfo: {
                                                        ...formData.financialInfo,
                                                        bankInfo: { ...formData.financialInfo.bankInfo, accountNumber: e.target.value }
                                                    }
                                                })}
                                                placeholder="Enter account number"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bankName">Bank Name</Label>
                                            <Input
                                                id="bankName"
                                                value={formData.financialInfo.bankInfo.bankName}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    financialInfo: {
                                                        ...formData.financialInfo,
                                                        bankInfo: { ...formData.financialInfo.bankInfo, bankName: e.target.value }
                                                    }
                                                })}
                                                placeholder="Enter bank name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="ifsc">IFSC Code</Label>
                                            <Input
                                                id="ifsc"
                                                value={formData.financialInfo.bankInfo.ifscCode}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    financialInfo: {
                                                        ...formData.financialInfo,
                                                        bankInfo: { ...formData.financialInfo.bankInfo, ifscCode: e.target.value.toUpperCase() }
                                                    }
                                                })}
                                                placeholder="Enter IFSC code"
                                                maxLength={11}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="branch">Branch</Label>
                                            <Input
                                                id="branch"
                                                value={formData.financialInfo.bankInfo.branch}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    financialInfo: {
                                                        ...formData.financialInfo,
                                                        bankInfo: { ...formData.financialInfo.bankInfo, branch: e.target.value }
                                                    }
                                                })}
                                                placeholder="Enter branch name"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Payroll Information Tab */}
                            <TabsContent value="payroll" className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 ">
                                        Payroll Details
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="taxCode">Tax Code</Label>
                                            <Input
                                                id="taxCode"
                                                value={formData.payrollInfo.taxCode}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    payrollInfo: { ...formData.payrollInfo, taxCode: e.target.value }
                                                })}
                                                placeholder="Enter tax code"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="benefits">Benefits & Allowances</Label>
                                        <Textarea
                                            id="benefits"
                                            value={formData.payrollInfo.benefits}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                payrollInfo: { ...formData.payrollInfo, benefits: e.target.value }
                                            })}
                                            placeholder="Enter benefits and allowances details"
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Settings Tab */}
                            <TabsContent value="settings" className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 ">
                                        Employee Status
                                    </h3>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Employment Status</Label>
                                        <Select
                                            value={formData.isActive ? 'active' : 'inactive'}
                                            onValueChange={(value) => setFormData({
                                                ...formData,
                                                isActive: value === 'active'
                                            })}
                                        >
                                            <SelectTrigger className="max-w-xs">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-gray-500">
                                            Inactive employees cannot access the system
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>

                    <Separator className="my-4" />

                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}