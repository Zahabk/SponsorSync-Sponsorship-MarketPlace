import React, { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EventService from "../services/event";
import TierReferenceCard from "../components/CreateEvent/TierReferenceCard";
import TierFormCard from "../components/CreateEvent/TierFormCard";
import {
  InputField,
  TextareaField,
  SelectField,
} from "../components/CreateEvent/FormField";

const cardCls =
  "bg-base-300/80 rounded-2xl border border-base-300/30 shadow-md p-6";

const EVENT_TYPES = [
  "conference",
  "concert",
  "corporate",
  "festival",
  "sports",
  "other",
];

const INITIAL_TIERS = [
  { name: "Gold", amount: 0, perks: "" },
  { name: "Silver", amount: 0, perks: "" },
  { name: "Bronze", amount: 0, perks: "" },
];

const DEFAULT_TIER_INFO = [
  {
    name: "Gold",
    price: 10000,
    benefits: [
      "Premium logo placement on all event materials",
      "Dedicated booth/stall space",
      "Stage mention/announcement",
      "VIP passes for team",
    ],
  },
  {
    name: "Silver",
    price: 5000,
    benefits: [
      "Logo placement on banners and digital screens",
      "Standard booth/stall space",
      "Event passes for team",
    ],
  },
  {
    name: "Bronze",
    price: 2500,
    benefits: [
      "Logo on event website and social media",
      "Limited passes for team",
    ],
  },
];

const INITIAL_FORM = {
  title: "",
  description: "",
  eventType: "other",
  eventDate: "",
  location: "",
  audienceSize: "",
  proposalDeadline: "",
};

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [tiers, setTiers] = useState(INITIAL_TIERS);
  const [bannerFile, setBannerFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onTierChange = (index, field, value) =>
    setTiers((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    );

  const onBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tiersPayload = tiers.map(({ name, amount, perks }) => ({
        name,
        price: Number(amount),
        benefits: perks
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }));

      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      data.append("tiers", JSON.stringify(tiersPayload));
      if (bannerFile) data.append("banner", bannerFile);

      await EventService.createEvent(data);
      toast.success("Event created successfully!");
      navigate("/events");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-extrabold tracking-tight mb-6">
          Create new event
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/*  Basic Info + Default Tier Reference */}
            <div className="flex flex-col gap-6">
              <div className={`${cardCls} flex flex-col gap-5`}>
                <p className="text-xs font-semibold text-primary tracking-widest uppercase">
                  Basic info
                </p>

                <InputField
                  required
                  label="Event title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={onFieldChange}
                  placeholder="e.g. Annual Tech Summit 2026"
                />

                <TextareaField
                  required
                  label="Description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={onFieldChange}
                  placeholder="Provide a comprehensive event description..."
                />

                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    label="Event type"
                    name="eventType"
                    options={EVENT_TYPES}
                    value={formData.eventType}
                    onChange={onFieldChange}
                  />
                  <InputField
                    required
                    label="Audience size"
                    name="audienceSize"
                    type="number"
                    value={formData.audienceSize}
                    onChange={onFieldChange}
                    placeholder="e.g. 2000"
                  />
                </div>

                <InputField
                  required
                  label="Location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={onFieldChange}
                  placeholder="e.g. Mumbai, India"
                />

                <div className="divider my-0" />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    required
                    label="Event date"
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={onFieldChange}
                  />
                  <InputField
                    required
                    label="Proposal deadline"
                    name="proposalDeadline"
                    type="date"
                    value={formData.proposalDeadline}
                    onChange={onFieldChange}
                  />
                </div>
              </div>

              {/* Default Tier Reference */}
              <div className={`${cardCls} flex flex-col gap-4`}>
                <p className="text-xs font-semibold text-primary tracking-widest uppercase">
                  Default tier reference
                </p>
                <div className="flex flex-col gap-3">
                  {DEFAULT_TIER_INFO.map((tier) => (
                    <TierReferenceCard key={tier.name} tier={tier} />
                  ))}
                </div>
              </div>
            </div>

            {/*  Banner + Sponsorship Tiers */}
            <div className="flex flex-col gap-6">
              {/* Banner */}
              <div className={`${cardCls} flex flex-col gap-4`}>
                <p className="text-xs font-semibold text-primary tracking-widest uppercase">
                  Event banner
                </p>
                {preview ? (
                  <div className="relative rounded-xl overflow-hidden border border-base-300">
                    <img
                      src={preview}
                      alt="Banner preview"
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setBannerFile(null);
                      }}
                      className="absolute top-2 right-2 btn btn-xs btn-error btn-circle"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label
                    className="flex flex-col items-center justify-center gap-2 min-h-36
                    border-2 border-dashed border-base-300 rounded-xl bg-base-100
                    cursor-pointer hover:border-primary transition-colors p-6"
                  >
                    <IoCloudUploadOutline className="text-4xl text-base-content/50" />
                    <span className="text-primary font-semibold text-sm text-center">
                      Click to upload
                    </span>
                    <input
                      type="file"
                      name="banner"
                      accept="image/*"
                      className="hidden"
                      onChange={onBannerChange}
                    />
                  </label>
                )}
              </div>

              {/* Sponsorship Tiers */}
              <div className={`${cardCls} flex flex-col gap-4`}>
                <p className="text-xs font-semibold text-primary tracking-widest uppercase">
                  Sponsorship tiers
                </p>
                <div className="flex flex-col gap-3">
                  {tiers.map((tier, i) => (
                    <TierFormCard
                      key={tier.name}
                      tier={tier}
                      index={i}
                      onChange={onTierChange}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-primary text-primary-content font-bold
              rounded-xl shadow-lg transition-all hover:opacity-95 disabled:opacity-50
              flex items-center justify-center gap-2"
          >
            {loading ? "Publishing event..." : "Publish event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
