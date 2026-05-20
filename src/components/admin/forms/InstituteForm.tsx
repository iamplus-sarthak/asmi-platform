"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UploadCloud, Plus, Trash2, MapPin, Users, Image as ImageIcon } from "lucide-react";
import { instituteSchema, InstituteFormValues } from "@/lib/validations/admin";
import { uploadMediaAction } from "@/actions/admin-crud";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InstituteFormProps {
  initialData?: any;
  instituteTypes: any[];
  states: any[];
  universities: any[];
  onSubmit: (data: InstituteFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function InstituteForm({
  initialData,
  instituteTypes,
  states,
  universities,
  onSubmit,
  isSubmitting,
}: InstituteFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  
  // Track files for the nested images array
  const [imageFiles, setImageFiles] = useState<Record<number, File>>({});
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<InstituteFormValues>({
    resolver: zodResolver(instituteSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      short_name: initialData?.short_name || "",
      institute_code: initialData?.institute_code || "",
      institute_type_id: initialData?.institute_type_id?.id || initialData?.institute_type_id || "",
      authority_type: initialData?.authority_type || undefined,
      state_id: initialData?.state_id?.id || initialData?.state_id || "",
      university_id: initialData?.university_id?.id || initialData?.university_id || "",
      established_year: initialData?.established_year || undefined,
      description: initialData?.description || "",
      website_url: initialData?.website_url || "",
      logo_url: initialData?.logo_url || "",
      cover_url: initialData?.cover_url || "",
      
      address: initialData?.address ? {
          id: initialData.address.id,
          address_line_1: initialData.address.address_line_1 || "",
          city: initialData.address.city || "",
          district: initialData.address.district || "",
          state_id: initialData.address.state_id?.id || initialData.address.state_id || "",
          pincode: initialData.address.pincode || "",
          latitude: initialData.address.latitude || undefined,
          longitude: initialData.address.longitude || undefined,
          google_maps_url: initialData.address.google_maps_url || "",
      } : undefined,
      
      contact_persons: initialData?.contact_persons || [],
      images: initialData?.images || [],
    },
  });

  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
      control: form.control,
      name: "contact_persons"
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
      control: form.control,
      name: "images"
  });

  const handleImageFileChange = (index: number, file: File | null) => {
      if (file) {
          setImageFiles(prev => ({ ...prev, [index]: file }));
      } else {
          setImageFiles(prev => {
              const newFiles = { ...prev };
              delete newFiles[index];
              return newFiles;
          });
      }
  };

  const handleFormSubmit = async (values: InstituteFormValues) => {
    try {
      setIsUploading(true);
      let logoUrl = values.logo_url;
      let coverUrl = values.cover_url;

      if (logoFile) {
        const formData = new FormData();
        formData.append("file", logoFile);
        formData.append("alt", `${values.name} Logo`);
        const res = await uploadMediaAction(formData);
        if (res.success && res.media) {
          logoUrl = res.media.url;
        }
      }

      if (coverFile) {
        const formData = new FormData();
        formData.append("file", coverFile);
        formData.append("alt", `${values.name} Cover`);
        const res = await uploadMediaAction(formData);
        if (res.success && res.media) {
          coverUrl = res.media.url;
        }
      }
      
      // Upload nested images
      const processedImages = [];
      if (values.images) {
          for (let i = 0; i < values.images.length; i++) {
              const img = values.images[i];
              const file = imageFiles[i];
              let uploadedUrl = img.image_url;
              
              if (file) {
                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("alt", `${values.name} ${img.image_type}`);
                  const res = await uploadMediaAction(formData);
                  if (res.success && res.media) {
                      uploadedUrl = res.media.url;
                  }
              }
              
              processedImages.push({
                  ...img,
                  image_url: uploadedUrl
              });
          }
      }

      await onSubmit({
        ...values,
        logo_url: logoUrl,
        cover_url: coverUrl,
        images: processedImages,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 pb-10">
        
        {/* Basic Details */}
        <div className="space-y-6">
            <h3 className="text-lg font-bold border-b pb-2">Basic Details</h3>
            
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Institute Name *</FormLabel>
                <FormControl>
                    <Input placeholder="Enter institute name" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="short_name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Short Name</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g. AIIMS" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="institute_code"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Institute Code</FormLabel>
                    <FormControl>
                    <Input placeholder="Code" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="institute_type_id"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Institute Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {instituteTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="authority_type"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Authority Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select authority" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="central">Central</SelectItem>
                        <SelectItem value="state">State</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="state_id"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {states.map((state) => (
                        <SelectItem key={state.id} value={state.id.toString()}>
                            {state.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="university_id"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>University</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select university" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {universities.map((uni) => (
                        <SelectItem key={uni.id} value={uni.id.toString()}>
                            {uni.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="established_year"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Established Year</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="YYYY" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="website_url"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                    <Input type="url" placeholder="https://" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea placeholder="Write a short description" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <div className="space-y-4 pt-2 border-b pb-6">
                <div>
                    <FormLabel className="block mb-2">Logo Upload</FormLabel>
                    <div className="flex items-center gap-4">
                    <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                    {form.watch("logo_url") && !logoFile && (
                        <span className="text-xs text-green-600 font-medium whitespace-nowrap">Current logo present</span>
                    )}
                    </div>
                </div>
                <div>
                    <FormLabel className="block mb-2">Cover Image Upload</FormLabel>
                    <div className="flex items-center gap-4">
                    <Input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
                    {form.watch("cover_url") && !coverFile && (
                        <span className="text-xs text-green-600 font-medium whitespace-nowrap">Current cover present</span>
                    )}
                    </div>
                </div>
            </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2"><MapPin className="h-5 w-5 text-indigo-500" /> Address Details</h3>
            
            <FormField
                control={form.control}
                name="address.address_line_1"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                        <Input placeholder="Street, Area" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="address.city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="address.district" render={({ field }) => (
                    <FormItem><FormLabel>District</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="address.state_id" render={({ field }) => (
                    <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {states.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="address.pincode" render={({ field }) => (
                    <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="address.latitude" render={({ field }) => (
                    <FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="address.longitude" render={({ field }) => (
                    <FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>

            <FormField control={form.control} name="address.google_maps_url" render={({ field }) => (
                <FormItem><FormLabel>Google Maps URL</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>


        {/* Contact Persons */}
        <div className="space-y-4 pt-6 border-t">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2"><Users className="h-5 w-5 text-blue-500" /> Contact Persons</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => appendContact({ name: "", designation: "dean", email: "", contact_no_1: "", contact_no_2: "" })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Person
                </Button>
            </div>

            {contactFields.map((field, index) => (
                <Card key={field.id} className="relative">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeContact(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <CardHeader className="pb-3 pt-4"><CardTitle className="text-base">Contact #{index + 1}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name={`contact_persons.${index}.name`} render={({ field }) => (
                                <FormItem><FormLabel>Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name={`contact_persons.${index}.designation`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Designation</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="dean">Dean</SelectItem>
                                            <SelectItem value="nodal_officer">Nodal Officer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name={`contact_persons.${index}.email`} render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name={`contact_persons.${index}.contact_no_1`} render={({ field }) => (
                                <FormItem><FormLabel>Contact No 1</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name={`contact_persons.${index}.contact_no_2`} render={({ field }) => (
                                <FormItem><FormLabel>Contact No 2</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* Extra Images */}
        <div className="space-y-4 pt-6 border-t">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2"><ImageIcon className="h-5 w-5 text-purple-500" /> Institute Images</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => appendImage({ image_type: "campus", image_url: "" })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Image
                </Button>
            </div>

            {imageFields.map((field, index) => (
                <Card key={field.id} className="relative">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeImage(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name={`images.${index}.image_type`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image Type *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="campus">Campus</SelectItem>
                                            <SelectItem value="hostel">Hostel</SelectItem>
                                            <SelectItem value="hospital">Hospital</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <div className="space-y-2">
                                <FormLabel>Upload Image</FormLabel>
                                <Input type="file" accept="image/*" onChange={(e) => handleImageFileChange(index, e.target.files?.[0] || null)} />
                                {form.watch(`images.${index}.image_url`) && !imageFiles[index] && (
                                    <span className="text-xs text-green-600 font-medium">Image uploaded</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="pt-6 mt-6 border-t flex justify-end">
          <Button type="submit" disabled={isSubmitting || isUploading} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Institute Details" : "Create Institute Complete Record"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
