"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    Globe, MapPin, BedDouble, Building, ArrowRight, 
    CheckCircle2, ArrowLeft, Loader2, Phone, Mail, 
    Award, Calendar, DollarSign, ShieldAlert, KeyRound 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getDocsAction, getDocByIdAction } from "@/actions/admin-crud";
import { recordEngagementAction } from "@/actions/analytics";

interface InstituteDetailTabProps {
    institute: {
        id: string | number;
        name: string;
        [key: string]: any;
    };
}

export function InstituteDetailTab({ institute }: InstituteDetailTabProps) {
    const router = useRouter();
    const [activeSubTab, setActiveSubTab] = useState<string>("Overview");
    const [isLoading, setIsLoading] = useState(true);

    // States for fetched data
    const [instDetails, setInstDetails] = useState<any>(null);
    const [addressInfo, setAddressInfo] = useState<any>(null);
    const [hospitalsList, setHospitalsList] = useState<any[]>([]);
    const [hostelsList, setHostelsList] = useState<any[]>([]);
    const [contactsList, setContactsList] = useState<any[]>([]);
    const [coursesList, setCoursesList] = useState<any[]>([]);
    const [courseFeesList, setCourseFeesList] = useState<any[]>([]);
    const [allotmentsList, setAllotmentsList] = useState<any[]>([]);

    useEffect(() => {
        const fetchAllInstituteDetails = async () => {
            if (!institute?.id) return;
            setIsLoading(true);
            try {
                // Fetch Base Institute Details
                const instRes = await getDocByIdAction({ collection: "institutes", id: institute.id });
                if (instRes.success && instRes.data) {
                    setInstDetails(instRes.data);
                    
                    // Fire-and-forget record view
                    recordEngagementAction("institutes", institute.id, "view").catch(console.error);
                }

                // Fetch Address Info
                const addrRes = await getDocsAction({
                    collection: "institute_address",
                    limit: 1,
                    query: { institute_id: { equals: institute.id } }
                });
                if (addrRes.success && addrRes.data?.docs?.[0]) {
                    setAddressInfo(addrRes.data.docs[0]);
                }

                // Fetch Connected Hospitals
                const hospRes = await getDocsAction({
                    collection: "institute_hospitals",
                    limit: 10,
                    query: { institute_id: { equals: institute.id } }
                });
                if (hospRes.success && hospRes.data?.docs) {
                    setHospitalsList(hospRes.data.docs);
                }

                // Fetch Hostels / Accommodation
                const hostelRes = await getDocsAction({
                    collection: "institute_hostels",
                    limit: 10,
                    query: { institute_id: { equals: institute.id } }
                });
                if (hostelRes.success && hostelRes.data?.docs) {
                    setHostelsList(hostelRes.data.docs);
                }

                // Fetch Contacts Info
                const contactRes = await getDocsAction({
                    collection: "institute_contact_persons",
                    limit: 20,
                    query: { institute_id: { equals: institute.id } }
                });
                if (contactRes.success && contactRes.data?.docs) {
                    setContactsList(contactRes.data.docs);
                }

                // Fetch Offered Courses
                const courseRes = await getDocsAction({
                    collection: "institute_courses",
                    limit: 100,
                    query: { institute_id: { equals: institute.id } }
                });
                let fetchedCourses: any[] = [];
                if (courseRes.success && courseRes.data?.docs) {
                    fetchedCourses = courseRes.data.docs;
                    setCoursesList(fetchedCourses);
                }

                // Fetch Course Fees and Bonds
                if (fetchedCourses.length > 0) {
                    const courseIds = fetchedCourses.map(c => c.id);
                    const feeRes = await getDocsAction({
                        collection: "institute_course_fees",
                        limit: 100,
                        query: { institute_course_id: { in: courseIds } }
                    });
                    if (feeRes.success && feeRes.data?.docs) {
                        setCourseFeesList(feeRes.data.docs);
                    }
                }

                // Fetch Allotments
                const allotmentRes = await getDocsAction({
                    collection: "allotments",
                    limit: 100,
                    query: { institute_id: { equals: institute.id } }
                });
                if (allotmentRes.success && allotmentRes.data?.docs) {
                    setAllotmentsList(allotmentRes.data.docs);
                }

            } catch (err) {
                console.error("Error loading comprehensive institute details:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllInstituteDetails();
    }, [institute?.id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-slate-500">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="font-semibold text-lg animate-pulse">Loading comprehensive details...</p>
            </div>
        );
    }

    const name = instDetails?.name || institute.name;
    const establishedYear = instDetails?.established_year || "N/A";
    const coverImage = typeof instDetails?.cover_url === "object" ? instDetails?.cover_url?.url : (instDetails?.cover_url || "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80");
    const logoUrl = typeof instDetails?.logo_url === "object" ? instDetails?.logo_url?.url : instDetails?.logo_url;
    const websiteUrl = instDetails?.website_url || "";
    const description = instDetails?.description || "No overview description available yet.";
    const universityName = typeof instDetails?.university_id === "object" ? instDetails?.university_id?.name : "Unknown University";
    const typeName = typeof instDetails?.institute_type_id === "object" ? instDetails?.institute_type_id?.name : "Medical College";
    const authority = instDetails?.authority_type === "central" ? "Central Govt" : "State Govt";

    const totalSeats = coursesList.reduce((acc, curr) => acc + (Number(curr.total_seats) || 0), 0);
    const totalBeds = hospitalsList.reduce((acc, curr) => acc + (Number(curr.bed_count) || 0), 0);

    return (
        <div className="flex flex-col h-full bg-white animate-in fade-in duration-300">
            {/* Hero Section */}
            <div className="relative h-[300px] w-full overflow-hidden shrink-0 group">
                <div className="absolute top-4 left-4 z-20">
                    <Button 
                        onClick={() => router.push("/dashboard/institutes")}
                        variant="secondary" 
                        className="bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 font-semibold rounded-xl shadow-md flex items-center gap-2 border border-slate-200/50 h-10 px-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <ArrowLeft className="h-4 w-4 text-blue-600" />
                        Back to Institutes
                    </Button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={coverImage}
                    alt={name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto flex items-end justify-between gap-6">
                    <div className="flex items-end gap-6">
                        <div className="h-28 w-28 bg-white rounded-2xl p-2 shadow-2xl shrink-0 -mb-12 relative z-10">
                            <div className="h-full w-full bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                {logoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <span className="font-bold text-slate-400">LOGO</span>
                                )}
                            </div>
                        </div>
                        <div className="text-white pb-2">
                            <h1 className="text-3xl font-bold mb-2 shadow-sm leading-tight max-w-4xl">{name}</h1>
                            <div className="flex items-center gap-4 text-slate-300 text-sm font-medium">
                                <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/10 text-white">
                                    {typeName}
                                </span>
                                <span className="flex items-center gap-1.5 align-middle">
                                    <MapPin className="h-4 w-4" /> {addressInfo?.city || "Unknown City"}, India
                                </span>
                                <span>•</span>
                                <span>Affiliated to {universityName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-2">
                        {websiteUrl && (
                            <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                                <Button className="bg-white text-slate-900 hover:bg-slate-100 border-none">
                                    <Globe className="mr-2 h-4 w-4 text-blue-600" /> Website
                                </Button>
                            </a>
                        )}
                        {addressInfo?.google_maps_url && (
                            <a href={addressInfo.google_maps_url} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="text-white border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-md">
                                    View Map <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-hidden flex flex-col pt-16">
                {/* Navigation Tabs */}
                <div className="border-b border-slate-200 sticky top-0 bg-white z-10 px-8">
                    <div className="max-w-7xl mx-auto flex gap-8">
                        {["Overview", "Closing Ranks", "Fee & More", "Contact Details", "Accommodation", "Clinical Info"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveSubTab(tab)}
                                className={`pb-4 text-sm font-bold transition-all border-b-2 ${activeSubTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <ScrollArea className="flex-1 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto p-8 space-y-8">
                        
                        {/* Sub-tab 1: Overview */}
                        {activeSubTab === "Overview" && (
                            <div className="space-y-8 animate-in fade-in duration-200">
                                {/* Quick Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {[
                                        { label: "Total Seats", value: totalSeats || "0", icon: Award },
                                        { label: "Management", value: authority, icon: Building },
                                        { label: "Hospital Beds", value: totalBeds || "N/A", icon: BedDouble },
                                        { label: "Established Year", value: establishedYear, icon: Calendar }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                                                <stat.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500 font-bold mb-1">{stat.label}</p>
                                                <p className="text-xl font-black text-slate-900">{stat.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-8">
                                        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                                <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                                About Institute
                                            </h3>
                                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                                                {description}
                                            </div>
                                        </section>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                                            <h4 className="font-bold text-slate-900">Address Location</h4>
                                            <div className="text-sm text-slate-600 space-y-2">
                                                <p><span className="font-bold text-slate-800">Address Line:</span> {addressInfo?.address_line_1 || "N/A"}</p>
                                                <p><span className="font-bold text-slate-800">City:</span> {addressInfo?.city || "N/A"}</p>
                                                <p><span className="font-bold text-slate-800">District:</span> {addressInfo?.district || "N/A"}</p>
                                                <p><span className="font-bold text-slate-800">Pincode:</span> {addressInfo?.pincode || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sub-tab 2: Closing Ranks */}
                        {activeSubTab === "Closing Ranks" && (
                            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                    Closing Ranks / Seat Allotments
                                </h3>
                                {allotmentsList.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                    <th className="py-3 px-4">Year</th>
                                                    <th className="py-3 px-4">Round</th>
                                                    <th className="py-3 px-4">Course</th>
                                                    <th className="py-3 px-4">Quota</th>
                                                    <th className="py-3 px-4">Category</th>
                                                    <th className="py-3 px-4 text-right">AI Rank</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allotmentsList.map((allot) => (
                                                    <tr key={allot.id} className="border-b border-slate-50 hover:bg-slate-50/50 text-sm">
                                                        <td className="py-3.5 px-4 font-bold text-slate-700">{allot.year}</td>
                                                        <td className="py-3.5 px-4 font-semibold text-slate-600">Round {allot.round_no}</td>
                                                        <td className="py-3.5 px-4 text-slate-600">
                                                            {typeof allot.institute_course_id === "object" 
                                                                ? (allot.institute_course_id?.label || "Course Info")
                                                                : "Course Info"}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-500">
                                                            {typeof allot.quota_id === "object" 
                                                                ? (allot.quota_id?.name || "N/A") 
                                                                : "N/A"}
                                                        </td>
                                                        <td className="py-3.5 px-4"><span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold text-slate-600">{allot.category}</span></td>
                                                        <td className="py-3.5 px-4 text-right font-black text-blue-600">{allot.ai_rank ? allot.ai_rank.toLocaleString("en-IN") : "-"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="py-16 text-center text-slate-400 font-medium bg-slate-50 border border-slate-100 rounded-2xl">
                                        No allotment or closing rank details found in the database.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Sub-tab 3: Fee & More */}
                        {activeSubTab === "Fee & More" && (
                            <div className="space-y-8 animate-in fade-in duration-200">
                                <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                        Annual Course Fees & Bonds
                                    </h3>
                                    {courseFeesList.length > 0 ? (
                                        <div className="space-y-6">
                                            {courseFeesList.map((fee) => {
                                                const courseLabel = typeof fee.institute_course_id === "object" ? fee.institute_course_id?.label : "Course";
                                                const counsellingName = typeof fee.counselling_id === "object" ? fee.counselling_id?.name : "Counselling";
                                                const quotaName = typeof fee.quota_id === "object" ? fee.quota_id?.name : "Quota";
                                                
                                                return (
                                                    <div key={fee.id} className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
                                                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 flex-wrap gap-2">
                                                            <h4 className="font-bold text-slate-800 text-base">{courseLabel}</h4>
                                                            <div className="flex gap-2">
                                                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">{counsellingName}</span>
                                                                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">{quotaName}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase mb-1">
                                                                    <DollarSign className="h-4 w-4 text-emerald-500" /> Annual Fee
                                                                </div>
                                                                <p className="text-lg font-black text-slate-800">
                                                                    {fee.annual_fee ? `₹ ${fee.annual_fee.toLocaleString("en-IN")}` : "N/A"}
                                                                </p>
                                                                {fee.fee_remarks && <p className="text-xs text-slate-400 mt-2">{fee.fee_remarks}</p>}
                                                            </div>

                                                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase mb-1">
                                                                    <Award className="h-4 w-4 text-blue-500" /> Stipend Details
                                                                </div>
                                                                <div className="space-y-1 text-sm font-semibold text-slate-700">
                                                                    <p>Year 1: {fee.stipend_year_1 ? `₹ ${fee.stipend_year_1.toLocaleString("en-IN")}` : "N/A"}</p>
                                                                    <p>Year 2: {fee.stipend_year_2 ? `₹ ${fee.stipend_year_2.toLocaleString("en-IN")}` : "N/A"}</p>
                                                                    <p>Year 3: {fee.stipend_year_3 ? `₹ ${fee.stipend_year_3.toLocaleString("en-IN")}` : "N/A"}</p>
                                                                </div>
                                                                {fee.stipend_remarks && <p className="text-xs text-slate-400 mt-2">{fee.stipend_remarks}</p>}
                                                            </div>

                                                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase mb-1">
                                                                    <ShieldAlert className="h-4 w-4 text-red-500" /> Service Bond
                                                                </div>
                                                                <p className="text-sm font-bold text-slate-800">Period: {fee.bond_years ? `${fee.bond_years} Years` : "N/A"}</p>
                                                                <p className="text-sm font-bold text-slate-800 mt-1">
                                                                    Penalty: {fee.bond_penalty_amount ? `₹ ${fee.bond_penalty_amount.toLocaleString("en-IN")}` : "N/A"}
                                                                </p>
                                                                {fee.bond_remarks && <p className="text-xs text-slate-400 mt-2">{fee.bond_remarks}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="py-16 text-center text-slate-400 font-medium bg-slate-50 border border-slate-100 rounded-2xl">
                                            No course fee or bond information available in the database.
                                        </div>
                                    )}
                                </section>
                            </div>
                        )}

                        {/* Sub-tab 4: Contact Details */}
                        {activeSubTab === "Contact Details" && (
                            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                    Nodal Officers & Contact Information
                                </h3>
                                {contactsList.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {contactsList.map((contact) => (
                                            <div key={contact.id} className="p-6 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-bold text-slate-800 text-lg">{contact.name}</h4>
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase">
                                                        {contact.designation === "dean" ? "Dean" : "Nodal Officer"}
                                                    </span>
                                                </div>
                                                <Separator className="bg-slate-200" />
                                                <div className="space-y-2 text-sm text-slate-600">
                                                    {contact.email && (
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-4 w-4 text-blue-500" />
                                                            <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
                                                        </div>
                                                    )}
                                                    {contact.contact_no_1 && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-4 w-4 text-blue-500" />
                                                            <span>{contact.contact_no_1}</span>
                                                        </div>
                                                    )}
                                                    {contact.contact_no_2 && (
                                                        <div className="flex items-center gap-2 pl-6">
                                                            <span>{contact.contact_no_2}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-16 text-center text-slate-400 font-medium bg-slate-50 border border-slate-100 rounded-2xl">
                                        No contact persons mapped for this institute.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Sub-tab 5: Accommodation */}
                        {activeSubTab === "Accommodation" && (
                            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                    Hostel Facilities
                                </h3>
                                {hostelsList.length > 0 ? (
                                    <div className="space-y-6">
                                        {hostelsList.map((hostel) => (
                                            <div key={hostel.id} className="p-6 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="bg-white p-5 rounded-xl border border-slate-150 flex items-center gap-4">
                                                        <span className="text-3xl">👦</span>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800">Men's Hostel</h4>
                                                            <p className="text-sm text-slate-500 font-medium mt-1">
                                                                {hostel.is_men_hostel_available ? "Available" : "Not Available"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white p-5 rounded-xl border border-slate-150 flex items-center gap-4">
                                                        <span className="text-3xl">👧</span>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800">Women's Hostel</h4>
                                                            <p className="text-sm text-slate-500 font-medium mt-1">
                                                                {hostel.is_women_hostel_available ? "Available" : "Not Available"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-6 rounded-xl border border-slate-150 space-y-3">
                                                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                        <KeyRound className="h-4 w-4 text-amber-500" />
                                                        Hostel Fees & Remarks
                                                    </h4>
                                                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                                        {hostel.hostel_fee_details || "No special fee details registered."}
                                                    </p>
                                                    
                                                    {hostel.hostel_fee_link && (
                                                        <div className="pt-2">
                                                            <a 
                                                                href={hostel.hostel_fee_link} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                                                            >
                                                                View Official Hostel Brochure <Globe className="h-3.5 w-3.5" />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-16 text-center text-slate-400 font-medium bg-slate-50 border border-slate-100 rounded-2xl">
                                        No hostel/accommodation facilities registered in the database for this institute.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Sub-tab 6: Clinical Info */}
                        {activeSubTab === "Clinical Info" && (
                            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                    Clinical Hospital Attachments
                                </h3>
                                {hospitalsList.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {hospitalsList.map((hosp) => (
                                            <div key={hosp.id} className="p-6 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-bold text-slate-800 text-lg">{hosp.hospital_name}</h4>
                                                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                        <BedDouble className="h-3.5 w-3.5" /> {hosp.bed_count} Beds
                                                    </span>
                                                </div>
                                                {hosp.description && (
                                                    <>
                                                        <Separator className="bg-slate-200" />
                                                        <p className="text-xs text-slate-500 leading-relaxed">
                                                            {hosp.description}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-16 text-center text-slate-400 font-medium bg-slate-50 border border-slate-100 rounded-2xl">
                                        No linked hospitals or clinical bed statistics found.
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
