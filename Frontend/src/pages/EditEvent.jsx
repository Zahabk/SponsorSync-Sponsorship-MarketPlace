import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EventService from "../services/event";
import TierReferenceCard from "../components/CreateEvent/TierReferenceCard";
import TierFormCard from "../components/CreateEvent/TierFormCard";
import {
  InputField,
  TextareaField,
  SelectField,
} from "../components/CreateEvent/FormField";
import { toast } from "react-toastify";
import { useOrganizerDashboard } from "../context/OrganizerDashboardContext";

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

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {refreshEvents} = useOrganizerDashboard()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "other",
    eventDate: "",
    location: "",
    audienceSize: "",
    proposalDeadline: "",
  });
  const [tiers, setTiers] = useState(INITIAL_TIERS);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await EventService.getEventDetails(id);
        const event = res.data;

        setFormData({
          title: event.title ?? "",
          description: event.description ?? "",
          eventType: event.eventType ?? "other",
          eventDate: new Date(event.eventDate).toISOString().split("T")[0],
          location: event.location ?? "",
          audienceSize: event.audienceSize ?? "",
          proposalDeadline: new Date(event.proposalDeadline)
            .toISOString()
            .split("T")[0]
        });

        if (event.tiers?.length) {
          setTiers(
            INITIAL_TIERS.map((init) => {
              const match = event.tiers.find((t) => t.name === init.name);
              return match
                ? {
                    name: match.name,
                    amount: match.price ?? 0,
                    perks: (match.benefits ?? []).join(", "),
                  }
                : init;
            }),
          );
        }
      } catch (err) {
        toast.error("Failed to load event details");
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    fetchEvent();
  }, [id]);

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onTierChange = (index, field, value) =>
    setTiers((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventDate = new Date(formData.eventDate);
    const proposalDeadline = new Date(formData.proposalDeadline);
    const today = new Date();

    if (eventDate < today) {
      toast.error("Event date cannot be in the past");
      return;
    }
    if (proposalDeadline >= eventDate) {
      toast.error("Proposal deadline must be before the event date");
      return;
    }

    setLoading(true);
    try {
      const filledTiers = tiers.filter(
        ({ amount, perks }) => Number(amount) > 0 || perks.trim() !== "",
      );

      const tiersPayload = filledTiers.map(({ name, amount, perks }) => ({
        name,
        price: Number(amount),
        benefits: perks
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }));

      const updateDetails = {
        ...formData,
        tiers: tiersPayload,
      };

      await EventService.updateEvent(id, updateDetails);
      toast.success("Event updated successfully!");
      refreshEvents()
      navigate("/dashboard/events");
    } catch (err) {
      toast.error("Failed to update event");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-extrabold tracking-tight mb-6">
          Update Event
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col gap-6">
              <div className={`${cardCls} flex flex-col gap-5`}>
                <p className="text-xs font-semibold text-primary tracking-widest uppercase">
                  Basic info
                </p>
                <InputField
                  label="Event title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={onFieldChange}
                  placeholder="e.g. Annual Tech Summit 2026"
                />
                <TextareaField
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
                    label="Audience size"
                    name="audienceSize"
                    type="number"
                    value={formData.audienceSize}
                    onChange={onFieldChange}
                    placeholder="e.g. 2000"
                  />
                </div>
                <InputField
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
                    label="Event date"
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={onFieldChange}
                  />
                  <InputField
                    label="Proposal deadline"
                    name="proposalDeadline"
                    type="date"
                    value={formData.proposalDeadline}
                    onChange={onFieldChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
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
            className="w-full mt-6 py-3 bg-primary text-primary-content font-bold rounded-xl shadow-lg transition-all hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Updating event..." : "Update event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
